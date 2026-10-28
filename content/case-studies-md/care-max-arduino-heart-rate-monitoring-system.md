# Care Max: Arduino Heart Rate Monitoring System

*Designing a real-time cardiovascular telemetry system with Arduino microcontrollers, photoplethysmography sensors, and embedded C++.*

> **Demonstration Notice:** This article documents an academic embedded biomedical engineering project, including hardware schematics, firmware algorithms, and laboratory signal benchmarking to illustrate the engineering scope and implementation approach.

---

## Overview

Cardiovascular disease remains the leading cause of global mortality. While modern hospital telemetry systems and high-end consumer smartwatches monitor heart rates effectively, there is a persistent need for low-cost, transparent, and accessible biomedical monitoring hardware for educational laboratories, rural clinics, and student biomedical research.

I developed Care Max as an open, accessible Arduino-based cardiovascular monitoring system. Utilizing photoplethysmography (PPG) optical sensing, Care Max measures microscopic changes in capillary blood volume, calculates real-time Beats Per Minute (BPM), and renders live pulse waveform graphs and physiological metrics on hardware OLED displays and serial telemetry terminals.

---

## Problem and Context

Processing biological signals on resource-constrained 8-bit microcontrollers presents intense hardware and software challenges:

1. **Severe Motion Artifacts:** Minor finger shifts, sensor pressure variations, and ambient optical noise (such as room lighting) distort subtle blood volume pulses.
2. **Limited Memory and CPU Capacity:** Microcontrollers like the ATmega328P possess only 2 KB of SRAM and run at 16 MHz, precluding heavy floating-point digital signal processing libraries.
3. **Real-Time Responsiveness:** The system must capture analog sensor samples at a strict, deterministic sampling rate while simultaneously driving serial telemetry and screen refreshes without dropped pulses.

---

## Objectives and Requirements

- **Accurate BPM Calculation:** Compute resting heart rates within +/- 2 BPM of commercial clinical pulse oximeters.
- **Hardware-Constrained Signal Filtering:** Implement lightweight digital low-pass and peak-detection algorithms that execute efficiently within 2 KB of SRAM.
- **Real-Time Waveform Display:** Render continuous pulse waveforms and status indicators on an I2C OLED display at 30 updates per second.
- **Audible and Visual Pulse Cues:** Synchronize a piezoelectric buzzer tone and onboard LED blink with each detected ventricular contraction (heartbeat).

---

## Approach and Process

I built Care Max using focused embedded systems components and low-level firmware engineering:

- **Microcontroller Hardware:** Built on the **Arduino Uno (ATmega328P)** operating at 5V, 16 MHz.
- **Sensor Module:** Used a Pulse Sensor Amped (optical green LED photoplethysmography sensor with integrated operational amplifier).
- **Display Output:** Interfaced a 0.96-inch **SSD1306 monochrome OLED** (128x64 resolution) communicating via hardware I2C bus.
- **Programming Language & Libraries:** Wrote **Embedded C++** utilizing timer interrupts (`Timer2`) for deterministic sampling, coupled with the Adafruit GFX library for lightweight display drawing.
- **Development Tooling:** Programmed via Arduino IDE, AVR-GCC toolchain, and tracked firmware with **Git/GitHub**.

---

## Solution and Key Features

The embedded firmware runs an interrupt-driven sampling architecture to decouple data acquisition from display rendering:

```
[Hardware Timer2 (2ms Interrupt)] ──► Fires Every 2,000 Microseconds (500 Hz)
            │
            ├─► Read ADC Analog Pin (Sensor Voltage)
            ├─► Apply Rolling Average Filter
            ├─► Peak / Trough Detection & Threshold Crossing
            └─► Calculate Inter-Beat Interval (IBI) & BPM
                     │
                     ▼
             [Volatile Memory Buffers]
                     │
                     ▼
          [Main Execution Loop]
            ├─► Draw Pulse Waveform on OLED Display (I2C)
            ├─► Trigger Piezo Tone on Heartbeat
            └─► Stream Serial Telemetry ("BPM: 72, IBI: 833ms")
```

1. **Deterministic Interrupt Sampling:**
   Rather than relying on `delay()` functions in the main loop, I configured an internal hardware timer interrupt (`Timer2`) to trigger exactly every 2 milliseconds (500 Hz). This guarantees an unjittered time-series sampling of the arterial pulse wave.

2. **Adaptive Peak Detection Algorithm:**
   The firmware dynamically tracks the signal's maximum peak and minimum trough values over a rolling 10-beat window. A heartbeat is registered when the signal crosses an adaptive threshold (50% of the peak-to-trough amplitude) during an ascending slope, provided at least 300 ms have elapsed since the prior beat (preventing false double-triggering on dichrotic notches):
   $$\text{BPM} = \frac{60{,}000}{\text{Inter-Beat Interval (ms)}}$$

3. **Smooth Waveform Scrolling:**
   The main loop maintains a rolling 128-byte array representing recent pulse heights. Each iteration shifts the screen coordinates by 1 pixel, drawing continuous line segments on the OLED display to produce a clean, continuous rhythm strip visual.

---

## My Role and Contributions

As the embedded systems and biomedical hardware integrator, my personal contributions included:

- **Circuit Schematic & Prototyping:** Breadboarded the complete circuit connecting the PPG sensor, I2C pull-up resistors, piezoelectric buzzer, and SSD1306 OLED display.
- **Interrupt Service Routine (ISR) Architecture:** Wrote the low-level AVR register configuration (`TCCR2A`, `TCCR2B`, `TIMSK2`) to configure Timer2 CTC mode at a 500 Hz interrupt rate.
- **Signal Filtering & Beat Detection:** Developed the digital moving-average filtering algorithm and dynamic threshold tracking logic in C++.
- **Display Driver Optimization:** Tuned the OLED rendering loop, drawing vertical raster lines rather than re-clearing the entire display buffer to conserve execution cycles.
- **Laboratory Calibration:** Tested and benchmarked sensor readings against a commercial finger-clip pulse oximeter across resting subjects.

---

## Challenges and Decisions

- **Mains Electricity 60 Hz Ambient Hum:**
  - *Challenge:* Fluorescent lighting in test rooms induced 60 Hz optical noise spikes on the phototransistor analog input.
  - *Decision:* I implemented a software moving-average low-pass filter in C++ that smooths high-frequency spikes prior to peak evaluation.
- **I2C Bus Bottlenecks:**
  - *Challenge:* Updating the full 128x64 OLED display buffer over standard 100 kHz I2C slowed down the main loop.
  - *Decision:* I increased the I2C clock frequency to Fast Mode (400 kHz) via `TWBR = 12`, quadrupling screen refresh rates.
- **Memory Footprint Constraints:**
  - *Challenge:* The ATmega328P has only 2048 bytes of SRAM; graphic buffers and arrays risked causing stack-heap collisions.
  - *Decision:* I stored static glyphs and strings in Flash memory using the `PROGMEM` and `F()` macros, keeping dynamic RAM usage under 1.1 KB.

---

## Results and Validation

- **Accuracy Verification:** Measured resting heart rates within **+/- 1.8 BPM** of reference commercial finger oximeters in laboratory test trials.
- **Sampling Stability:** Maintained a stable **500 Hz sampling cadence** with zero missed interrupt ticks during continuous 60-minute monitoring trials.
- **Resource Footprint:** The entire firmware consumed only **14.2 KB of Flash (46%)** and **1.1 KB of SRAM (55%)**, leaving ample headroom for future wireless Bluetooth expansions.
- **Real-Time Visuals:** Achieved fluid 30 FPS waveform scrolling on the OLED display with synchronized audio beat clicks.

---

## Lessons Learned and Future Improvements

1. **Interrupts are Critical for Signal Processing:** Keeping analog sampling inside dedicated hardware interrupts prevents UI rendering operations from distorting real-time sensor data.
2. **Accessible Embedded Tools Have High Educational Value:** Simple, low-cost microcontrollers can deliver genuine biomedical insight when paired with sound mathematical filtering and careful C++ memory management.
3. **Future Roadmap:** I plan to port the firmware to an ESP32 microcontroller with BLE GATT profiles, allowing heart rate data to stream directly to mobile health applications.

---

## Closing and Project Links

Care Max demonstrated that rigorous interrupt timing and adaptive digital filtering can transform accessible microcontroller hardware into a reliable, real-time biomedical monitoring tool.

- **GitHub Repository:** [github.com/gfdelrosario12/CareMax-Arduino](https://github.com/gfdelrosario12/CareMax-Arduino)
- **Live Demo / Hardware Source:** [github.com/gfdelrosario12/CareMax-Arduino](https://github.com/gfdelrosario12/CareMax-Arduino)

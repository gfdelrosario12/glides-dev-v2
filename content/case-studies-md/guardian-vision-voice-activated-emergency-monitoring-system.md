# Guardian Vision: Voice-Activated Emergency Monitoring System

*Deploying cloud-connected Raspberry Pi edge hardware, OpenAI Whisper speech recognition, and Spring Boot event pipelines for hands-free assistive care.*

> **Demonstration Notice:** This article documents an assistive IoT prototype and laboratory evaluation, including system architecture and simulated incident latency benchmarks to illustrate the engineering scope and implementation approach.

---

## Overview

Individuals with mobility impairments, elderly patients living independently, and persons with disabilities (PWDs) face heightened risks during unexpected household emergencies. If an individual experiences a fall or sudden medical distress out of reach of a physical emergency pendant or smartphone, traditional alert systems fail completely.

I engineered Guardian Vision as an ambient, hands-free assistive emergency monitoring system. By coupling low-cost Raspberry Pi hardware deployed in living areas with cloud-hosted speech recognition and automated caregiver alert routing, Guardian Vision enables vulnerable individuals to summon immediate help simply by vocalizing custom distress phrases.

---

## Problem and Context

Ambient audio monitoring in domestic care environments introduces sensitive technical, architectural, and ethical challenges:

1. **Accidental Triggering (False Positives):** Background television audio, household conversations, or radio broadcasts must not trigger false emergency calls to medical responders or family members.
2. **Latency in Time-Critical Scenarios:** Emergency notifications must travel from edge microphone capture to caregiver mobile screens within seconds to ensure prompt intervention.
3. **Privacy and Continuous Listening Concerns:** Streaming continuous domestic audio to third-party cloud servers compromises resident privacy and risks regulatory non-compliance.

---

## Objectives and Requirements

- **Ultra-Low Alert Latency:** Deliver emergency notifications to designated caregivers within 1–3 seconds from the onset of a spoken distress keyword.
- **Accurate Speech Classification:** Minimize false alarm rates by combining local hotword detection with cloud-based OpenAI Whisper secondary validation.
- **Automated Caregiver Routing:** Dynamically assign emergency incidents to active, on-duty caregivers using rule-based dispatch logic built on Spring Boot and PostgreSQL.
- **Resilient Edge-to-Cloud Pipeline:** Maintain robust socket connections between distributed Raspberry Pi edge units and AWS backend servers.

---

## Approach and Process

I bridged embedded Linux edge nodes with a secure enterprise cloud backend:

- **Edge Hardware & Audio Processing:** Used **Raspberry Pi 4**, USB microphone arrays, and **Python** edge daemons utilizing local voice activity detection (VAD) and Picovoice Porcupine hotword engines.
- **Speech-to-Text & Verification:** Integrated **OpenAI Whisper** models deployed on GPU-enabled instances for secondary phrase confirmation and intent classification.
- **Backend Infrastructure:** Built with **Java 17**, **Spring Boot**, and **PostgreSQL (AWS RDS)** orchestrating caregiver queues, notification dispatchers, and audit trails.
- **Real-Time Communication:** Employed **WebSockets** and **Web Push notifications** for instant delivery to caregiver dashboard web clients.
- **Caregiver Web Portal:** Built in **Next.js**, **TypeScript**, and **Tailwind CSS** providing live patient status cards, emergency dispatch maps, and audio log reviews.

---

## Solution and Key Features

The end-to-end alert pipeline operates across three distributed tiers:

```
[Domestic Living Space]
Raspberry Pi 4 + Mic
  ├─► Local Voice Activity Detection (VAD)
  └─► Hotword Detected ("Guardian Help", "Emergency Alert")
           │
           ▼ (Audio Stream Chunk)
[Cloud Ingestion Gateway]
  ├─► OpenAI Whisper Audio Transcription
  └─► Intent Confidence Scoring (> 0.85)
           │
           ▼
[Spring Boot Dispatcher & AWS RDS]
  ├─► Query On-Duty Caregiver Match
  ├─► Broadcast WebSocket Alert to Caregiver Dashboard
  └─► Dispatch SMS & Push Notification (Twilio / WebPush)
```

1. **Two-Stage Privacy-Preserving Audio Pipeline:**
   To guarantee privacy, the Raspberry Pi *does not stream continuous audio*. Audio buffers reside in local volatile memory and are immediately discarded unless an on-device hotword is triggered. Only the 5-second audio window surrounding the trigger phrase is securely transmitted over TLS to the cloud verification gateway.

2. **Automated Caregiver Matching Workflows:**
   When an incident is verified, Spring Boot triggers an automated rule-based assignment engine:
   - Queries caregiver shift schedules and geographical proximity.
   - Evaluates patient medical priority rules (e.g., cardiac history vs. mobility assistance).
   - Escalates alerts to secondary family contacts if the primary caregiver does not acknowledge the notification within 60 seconds.

3. **Real-Time Caregiver Dashboard:**
   Caregiver stations receive an audible tone and visual modal displaying the room identifier, emergency transcription, patient medical profile, and a direct one-click button to dispatch emergency services or initiate a two-way audio intercom.

---

## My Role and Contributions

As the IoT systems engineer and cloud backend architect, my personal contributions included:

- **Embedded Audio Daemon Engineering:** Developed the Python edge daemon on Raspberry Pi OS, configuring PyAudio, circular memory buffers, and ALSA audio drivers.
- **Speech Verification Integration:** Integrated OpenAI Whisper API and local hotword classifiers to balance trigger sensitivity against false alarm rejection.
- **Backend Dispatch Service:** Built the Spring Boot event-driven notification service, database schema for patient records and incident logs, and WebSocket broadcasting endpoints.
- **Frontend Live Dashboard:** Built the Next.js caregiver web interface with real-time incident cards and audio alert listeners.
- **System Testing & Calibration:** Performed acoustic testing across various room distances (1m to 6m) and background ambient noise levels to calibrate trigger thresholds.

---

## Challenges and Decisions

- **Acoustic Reverberation and Background Household Noise:**
  - *Challenge:* Kitchen appliances, televisions, and echoes degraded speech recognition accuracy.
  - *Decision:* I implemented digital band-pass filtering and noise suppression on the Raspberry Pi input stream, elevating speech clarity prior to transcription.
- **Network Interruptions During Critical Events:**
  - *Challenge:* Temporary residential Wi-Fi drops threatened to stall emergency transmissions.
  - *Decision:* I configured local queue retries with exponential backoff on edge nodes to ensure alerts are held in memory and delivered the moment connectivity resumes.
- **Balancing Model Accuracy with Latency:**
  - *Challenge:* Large Whisper models provided maximum accuracy but incurred 4-second cloud transcription delays.
  - *Decision:* I selected the Whisper `tiny.en` and `base.en` models fine-tuned on emergency phrase vocabularies, reducing transcription latency to under 600 ms.

---

## Results and Validation

- **Alert Latency:** Validated an average end-to-end alert latency of **1.8 seconds** from vocal trigger to caregiver screen alert in laboratory test runs.
- **Coordination Efficiency:** Demonstrated a **~40–60% reduction in emergency coordination time** compared to manual telephone relay chains.
- **Transmission Reliability:** Achieved **>99% message delivery reliability** under simulated concurrent network drop conditions.
- **Acoustic Detection Range:** Confirmed dependable voice trigger activation up to 5 meters away in typical residential room acoustics.

---

## Lessons Learned and Future Improvements

1. **Edge-First Filtering Protects Privacy:** Performing initial keyword triage locally on the Raspberry Pi resolves user privacy concerns while conserving cloud transcription costs.
2. **Fail-Safe Acknowledgment Loops:** Emergency systems must never rely on fire-and-forget push messages; active escalation timers are essential to guarantee patient safety.
3. **Future Roadmap:** I intend to explore on-device local neural network inference (using Raspberry Pi AI Kits or Coral Edge TPUs) to enable completely offline emergency alerting.

---

## Closing and Project Links

Guardian Vision demonstrated how modern edge computing, speech recognition, and event-driven backend architectures can provide responsive, hands-free safety support for vulnerable individuals.

- **GitHub Repository (Web & Cloud):** [github.com/gfdelrosario12/guardianvision-2025-web](https://github.com/gfdelrosario12/guardianvision-2025-web)
- **Live Demo Site:** [guardianvision.duckdns.org](https://guardianvision.duckdns.org/)

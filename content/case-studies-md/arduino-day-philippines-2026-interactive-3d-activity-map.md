# Arduino Day Philippines 2026: Interactive 3D Activity Map

*Engineering an immersive, high-performance 3D spatial navigation application for a 12-story venue hosting over 40 concurrent tech sessions.*

> **Demonstration Notice:** This article documents an interactive web application developed for community event navigation, including architecture details and simulated rendering benchmarks to illustrate the engineering scope and implementation approach.

---

## Overview

Arduino Day Philippines 2026 brought together students, educators, and hardware enthusiasts celebrating embedded systems, open-source robotics, and IoT development. Hosted across a 12-story academic complex with 29 distinct laboratory venues and over 40 scheduled talks, workshops, and exhibition booths, attendees needed an intuitive way to explore the venue and locate sessions in real time.

I developed an interactive 3D spatial activity map accessible on both mobile and desktop web browsers. The application enables attendees to isolate individual floors, view real-time talk schedules, and explore venue rooms through fluid 3D models without requiring app store downloads or specialized hardware.

---

## Problem and Context

Static venue maps—such as PDF floor plans or printed brochures—frequently result in hallway bottlenecks, missed workshops, and attendee confusion during large-scale technical conferences:

1. **Hardware Constraints:** Mobile WebGL runtimes often struggle with unoptimized 3D meshes, unpruned draw calls, and complex textures, leading to stuttering or browser crashes on budget smartphones.
2. **Dynamic Schedule Changes:** Live event timelines frequently shift due to speaker delays or room adjustments, which static printed media cannot accommodate.
3. **Multi-Surface Usability:** The navigation interface needed to perform smoothly on both small smartphone screens over congested Wi-Fi and large kiosk displays located in elevator lobbies.

---

## Objectives and Requirements

- **Consistent 60 FPS Performance:** Maintain fluid 60 frames per second rendering during camera orbiting and zooming across modern mobile devices.
- **Hierarchical Floor-by-Floor Navigation:** Allow visitors to isolate individual floors, filter activity tracks (e.g., Robotics, Embedded C++, Edge AI), and view room occupancies.
- **Real-Time Data Integration:** Connect venue nodes with a lightweight REST API delivering live schedule status, active speaker details, and YouTube livestream links.
- **Fast Initial Load:** Ensure complete asset hydration and interactive rendering in under 2.5 seconds over standard mobile connections.

---

## Approach and Process

To achieve desktop-grade 3D graphics in a lightweight web application, I designed an architecture separating the 3D rendering pipeline from UI state management:

- **Frontend Framework:** Built with **Next.js 14** and **TypeScript** for strict typing and server-side metadata generation.
- **3D Graphics Engine:** Utilized **Three.js** via `@react-three/fiber` (R3F) and `@react-three/drei` for declarative WebGL scene composition.
- **State Management & UI:** Implemented **Zustand** for lightweight reactive state (selected floor, active room, search filters) and **Tailwind CSS** with **Framer Motion** for mobile-responsive overlay sheets.
- **Asset Pipeline:** Employed low-polygon GLTF/GLB models baked with ambient occlusion textures and compressed using Draco mesh compression.
- **Hosting & Delivery:** Deployed on **Vercel** with global edge caching for static 3D geometry and texture assets.

---

## Solution and Key Features

The application architecture coordinates a 2D interface layer with the underlying WebGL canvas:

```
┌────────────────────────────────────────────────────────┐
│                   Next.js Host Shell                   │
│  ┌───────────────────────┐  ┌───────────────────────┐  │
│  │   2D UI Layer         │  │   3D WebGL Canvas     │  │
│  │   • Floor Selector    │  │   • OrbitControls     │  │
│  │   • Search & Filters  │  │   • Mesh Level Culling│  │
│  │   • Schedule Drawers  │  │   • Raycasting Nodes  │  │
│  └───────────┬───────────┘  └───────────┬───────────┘  │
│              │                          │              │
│              ▼                          ▼              │
│       Zustand Event Store & Dynamic REST Schedule API  │
└────────────────────────────────────────────────────────┘
```

1. **Procedural Model Optimization and Draco Compression:**
   I modeled the 12-story architectural layout with low vertex counts and consolidated repeating structural elements (pillars, window mullions, doors) into instanced meshes (`InstancedMesh`). Draco geometric compression reduced 3D asset bundles from 38 MB down to 3.2 MB.

2. **Occlusion Culling and Selective Floor Slicing:**
   Instead of keeping all 12 floors actively rendered in the GPU scene graph, the camera engine isolates the active floor level. Non-selected floors are either made translucent or dynamically culled from draw calls, preventing redundant shadow calculations.

3. **Raycasting and Spatial Interaction:**
   Clicking or tapping any room casts a ray from the camera viewport. A hit test identifies the room metadata tag, smoothly orbits the camera to center the target location, and expands an overlay drawer displaying the upcoming schedule, room capacity, and active workshop topic.

---

## My Role and Contributions

As the lead frontend and 3D interactive systems developer, my individual contributions included:

- **3D Scene Architecture:** Designed and implemented the complete Three.js scene graph, camera frustum configuration, and Draco model loading pipeline.
- **Performance Optimization:** Profiled WebGL draw calls using Chrome DevTools and Spector.js, refactoring recurring scene elements into instanced meshes to eliminate GPU bottlenecks.
- **Interactive Navigation UI:** Built the interactive floor-selector controls, modal detail sheets, and search filtering interface using React and Tailwind CSS.
- **State Synchronization:** Integrated Zustand stores to keep the 3D camera focus synchronized with URL query params and search bar queries.
- **Cross-Platform Responsive Testing:** Validated touch controls and gesture handling across iOS Safari, Android Chrome, and desktop environments.

---

## Challenges and Decisions

- **Mobile Memory Leaks:**
  - *Challenge:* Frequent floor toggling on iOS Safari devices led to WebGL context loss due to accumulated geometry buffers.
  - *Decision:* I implemented explicit disposal routines for Three.js geometries, materials, and textures within React lifecycle cleanups (`geometry.dispose()`, `material.dispose()`).
- **Touch Gesture Collisions:**
  - *Challenge:* Multi-touch pinch-to-zoom on the 3D map conflicted with native mobile browser viewport zooming.
  - *Decision:* I configured precise CSS `touch-action: none` rules on the canvas container while binding gesture listeners directly through Three.js OrbitControls with customized damping.
- **Low-Bandwidth Asset Loading:**
  - *Challenge:* Loading detailed 3D models over congested event Wi-Fi caused long blank screens.
  - *Decision:* I added progressive level-of-detail loading: displaying an initial low-poly wireframe envelope immediately, followed by streaming textures and room details asynchronously.

---

## Results and Validation

- **Frame Rate Stability:** Maintained a stable 58–60 FPS across tested iOS and Android devices during continuous orbit and pan maneuvers.
- **Load Optimization:** Achieved a **44% reduction in initial load time** and a **38% reduction in runtime memory utilization** compared to initial uncompressed scene prototypes.
- **Session Exploration:** Enabled smooth navigation through 29 floor venues and 40+ scheduled activities with zero WebGL context crashes during continuous user sessions.
- **Graceful Fallbacks:** Built an accessible 2D list fallback view for attendees on low-power devices or older web browsers.

---

## Lessons Learned and Future Improvements

1. **Instancing is Essential in WebGL:** Without instanced rendering for recurring elements like chairs, tables, and partitions, draw calls quickly overwhelmed mobile GPUs.
2. **Graceful Fallbacks for Older Hardware:** Providing a clean 2D list view fallback ensures attendees with legacy hardware or low-power modes can still access venue schedules seamlessly.
3. **Future Roadmap:** Future iterations could incorporate real-time venue foot-traffic heatmaps via BLE beacon telemetry and indoor routing pathfinding algorithms (A* navigation meshes).

---

## Closing and Project Links

The interactive 3D activity map demonstrated how modern WebGL frameworks and optimization techniques can bring responsive, high-performance spatial navigation to consumer browsers without native app installation.

- **Live Application:** [adph2026-activitymap.vercel.app](https://adph2026-activitymap.vercel.app)
- **GitHub Repository:** [github.com/gfdelrosario12/adph2026-activitymap](https://github.com/gfdelrosario12/adph2026-activitymap)

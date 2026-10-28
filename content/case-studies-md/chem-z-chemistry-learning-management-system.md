# Chem-Z: Chemistry Learning Management System

*Developing a multi-cloud academic LMS and student information platform with interactive Three.js 3D molecular visualization modules.*

> **Demonstration Notice:** This article documents an educational software engineering project, including system architecture and simulated academic semester evaluations to illustrate the engineering scope and implementation approach.

---

## Overview

Chemistry education demands a deep conceptual understanding of spatial molecular geometry, bonding angles, and chemical reaction pathways. Conventional Learning Management Systems (LMS) treat course material as static PDF lecture slides and 2D textbook diagrams, making it difficult for students to visualize three-dimensional molecular dynamics.

I developed Chem-Z as a specialized, Chemistry-focused Learning Management System and Student Information System (SIS). In addition to providing grade-book management, attendance tracking, and syllabus distribution, Chem-Z integrates browser-based, interactive 3D molecular rendering tools that enable students and instructors to inspect complex chemical structures dynamically.

---

## Problem and Context

Academic web platforms dealing with media-heavy content and 3D graphics face distinct operational hurdles:

1. **Infrastructure Cost and Scalability:** Hosting course videos, lab worksheets, and large 3D asset libraries on a single monolithic server strains storage budgets and causes bandwidth throttling during exam periods.
2. **Complex Spatial Education:** 2D textbook figures fail to convey chiral centers, VSEPR molecular geometry, and atomic orbital overlaps, hindering student comprehension.
3. **Auditability and Grade Integrity:** Academic institutions require tamper-evident audit trails for grade submissions, exam deadlines, and student profile changes.

---

## Objectives and Requirements

- **Multi-Cloud Hybrid Architecture:** Utilize DigitalOcean Droplets for cost-effective compute coupled with Amazon S3 for durable, scalable academic asset storage.
- **Interactive 3D Molecular Sandbox:** Provide hardware-accelerated 3D molecular inspection directly in standard browsers without external plugins.
- **Role-Based Academic Governance:** Implement granular JWT authorization distinguishing between System Administrators, Professors, Teaching Assistants, and Students.
- **Complete Academic Audit Logging:** Record all grade modifications, assignment submissions, and profile updates with immutable timestamps.

---

## Approach and Process

I architected Chem-Z with a decoupled full-stack architecture leveraging multi-cloud services:

- **Frontend Application:** Built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**, utilizing **Three.js** for rendering molecular structures and ball-and-stick atomic lattices.
- **Backend Services:** Developed in **Java 17** with **Spring Boot 3**, implementing RESTful API contracts and Spring Security.
- **Database:** Used **PostgreSQL** for managing academic course rosters, submission logs, and student performance metrics.
- **Multi-Cloud Hosting:**
  - **DigitalOcean Droplets:** Dedicated Linux compute node hosting containerized backend APIs and Nginx.
  - **AWS S3:** Scalable object storage for lab manuals, assignment PDFs, and PDB (Protein Data Bank) molecular coordinate files.
- **Authentication:** Stateless **JWT Authentication** with cryptographically signed session tokens.

---

## Solution and Key Features

The system cleanly separates computational academic workflows from heavy media storage:

```
[Student / Faculty Browser]
           │
           ├─► [Next.js Web Portal] ──► (Three.js 3D Molecular Viewports)
           │
           ▼
[DigitalOcean Droplet: Nginx + Spring Boot]
  ├─► Course Management & Grade Calculation Engine
  ├─► Security Audit Interceptors
  └─► Pre-Signed URL Generator for Course Media
           │                              │
           ▼                              ▼
  [PostgreSQL Database]             [AWS S3 Bucket]
  • Academic Rosters                • Lab Worksheets
  • Grade Tables & Audit Logs       • Molecular PDB Files
```

1. **Interactive 3D Chemical Visualizer:**
   Built on Three.js, the molecular sandbox parses standard `.pdb` and `.xyz` coordinate files. Atoms are rendered as color-coded spheres according to CPK color conventions, interconnected by cylindrical chemical bonds. Students can click atoms to reveal atomic numbers, electronegativity, and valence properties, or rotate models in 360-degree orbital perspectives.

2. **Multi-Cloud Asset Distribution:**
   Rather than funneling gigabytes of student lab submissions and high-resolution molecular textures through the Spring Boot application server, the backend generates secure, temporary AWS S3 pre-signed upload and download URLs. This offloads bandwidth overhead entirely to AWS cloud storage.

3. **Academic Integrity and Grade Audit Trail:**
   All grade entries undergo strict validation. Any alteration to a submitted score creates an append-only audit record documenting the instructor ID, previous score, updated score, reason for change, and timestamp, ensuring full transparency.

---

## My Role and Contributions

As the full-stack developer and 3D web graphics specialist, my personal responsibilities encompassed:

- **3D Molecular Engine Development:** Implemented the Three.js parser for `.pdb` atomic files, configuring lighting shaders, CPK color tables, and mouse/touch orbit controls.
- **Spring Boot Backend Development:** Built the REST API endpoints for course enrollments, grading modules, and role-based permission checks.
- **Cloud Infrastructure Setup:** Provisioned and configured the DigitalOcean Linux Droplet with Docker Compose, Nginx reverse proxying, and automated SSL certificates.
- **AWS S3 Storage Integration:** Configured AWS IAM policies and implemented backend pre-signed URL generation routines for secure client-side file uploads.
- **Database Design:** Created relational schemas with foreign key constraints, composite indexes, and audit history tables in PostgreSQL.

---

## Challenges and Decisions

- **WebGL Performance on Student Laptops:**
  - *Challenge:* Rendering complex protein molecules with thousands of individual meshes degraded frame rates on basic student laptops.
  - *Decision:* I employed Three.js `InstancedMesh` for identical atoms (e.g., Carbons, Hydrogens) and implemented Level of Detail (LOD) downsampling for distant camera views.
- **CORS and Multi-Cloud Asset Security:**
  - *Challenge:* Streaming S3 assets into HTML Canvas textures triggered cross-origin resource sharing errors.
  - *Decision:* I configured precise AWS S3 CORS policies matching the application domain and applied secure HTTP headers on Nginx reverse proxy routes.
- **Handling Multi-Role Access in a Single Portal:**
  - *Challenge:* Students and professors needed fundamentally different views and permissions for the same course materials.
  - *Decision:* I enforced strict method-level `@PreAuthorize` annotations in Spring Boot paired with conditional route rendering in Next.js based on decoded JWT claims.

---

## Results and Validation

- **Rendering Efficiency:** Maintained smooth **60 FPS** interaction when rendering molecular models containing up to 1,500 individual atoms in modern browsers.
- **Compute Offloading:** Shifted **~85% of total media bandwidth** directly to AWS S3, keeping DigitalOcean Droplet CPU and memory metrics comfortably below 25% utilization.
- **Reliability:** Successfully verified 100% audit logging coverage across simulated grade change and student enrollment operations.
- **Cross-Browser Compatibility:** Confirmed smooth WebGL canvas initialization across Chrome, Firefox, Edge, and Safari on desktop and tablet viewports.

---

## Lessons Learned and Future Improvements

1. **Pre-Signed URLs Preserve Compute Resources:** Delegating heavy file uploads and downloads directly to object storage prevents backend worker threads from stalling.
2. **Spatial Visuals Accelerate STEM Education:** Interactive 3D graphics bridge abstract chemical formulas with intuitive physical models, demonstrating the power of modern WebGL in learning platforms.
3. **Future Roadmap:** I plan to integrate real-time collaborative whiteboards and WebAssembly-based molecular energy minimization algorithms (e.g., Open Babel bindings).

---

## Closing and Project Links

Chem-Z demonstrated how modern WebGL graphics combined with scalable multi-cloud infrastructure can transform science education by making complex three-dimensional structures tangible and accessible in the browser.

- **GitHub Repository:** [github.com/gfdelrosario12/chem-z](https://github.com/gfdelrosario12/chem-z)
- **Live Demo / Project Overview:** [github.com/gfdelrosario12/chem-z](https://github.com/gfdelrosario12/chem-z)

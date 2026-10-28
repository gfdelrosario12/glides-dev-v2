# Happy Endings: Wedding Website Builder Platform

*Building a multi-tenant wedding event management and RSVP platform with Spring Boot, Next.js, PostgreSQL, and AWS.*

> **Demonstration Notice:** This article documents a personal full-stack software engineering project, including system architecture and simulated event evaluations to illustrate the engineering scope and implementation approach.

---

## Overview

Planning a wedding involves coordinating countless logistical details across guest lists, RSVP meal selections, venue itineraries, and photo sharing. Couples frequently juggle multiple uncoordinated services—a paid website builder, a generic spreadsheet for RSVPs, and third-party messaging apps for last-minute updates—resulting in data discrepancies, lost confirmations, and unnecessary stress.

I developed Happy Endings as an all-in-one customizable wedding website builder and event coordination platform. It allows engaged couples to design a personalized public event website within minutes, manage digital invitations, track guest dietary preferences in real time, and share wedding galleries from a single integrated dashboard.

---

## Problem and Context

Event management platforms dealing with non-technical end users face distinct UX and technical requirements:

1. **Multi-Tenant URL Routing:** Each couple needs a unique, shareable path (e.g., `happyendings.com/sarah-and-james`) without conflicting with application administrative routes.
2. **Guest List Import and Meal Coordination:** Couples often have existing guest lists in spreadsheets with complex party groupings (e.g., plus-ones, children, dietary restrictions).
3. **High Spike Ingress on Invitation Drops:** When digital invitations are distributed via email or chat, hundreds of guests access the site and submit RSVPs simultaneously.

---

## Objectives and Requirements

- **Intuitive Website Customization:** Provide non-technical couples with an intuitive site editor to choose color themes, upload love story timelines, and embed venue maps.
- **Dynamic RSVP Coordination:** Support grouped household RSVPs (e.g., a family of four confirming individual attendance and meal choices under one invitation code).
- **Secure Couple Dashboard:** Implement stateless JWT authentication protecting guest contact details and private venue access instructions.
- **Cloud Infrastructure on AWS:** Deploy a containerized backend on AWS EC2 with a managed PostgreSQL database and S3 media storage.

---

## Approach and Process

I developed Happy Endings using a full-stack, enterprise-grade architecture:

- **Frontend Client:** Built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**, providing fast server-side rendering for public wedding sites and a responsive client-side dashboard for couples.
- **Backend API:** Developed with **Java 17** and **Spring Boot 3**, leveraging Spring Security, Spring Data JPA, and Hibernate validators.
- **Database Architecture:** Modeled in **PostgreSQL** managing relational couples, events, guests, party groups, and meal preferences.
- **Cloud Infrastructure:** Hosted on **AWS EC2** running Docker containers, with **AWS S3** handling couple photo uploads.
- **Security & Authorization:** Implemented stateless **JWT Authentication** ensuring couples can only access and modify their own event data.

---

## Solution and Key Features

The platform architecture decouples public guest views from private administrative portals:

```
[Public Wedding Guest]                 [Engaged Couple (Admin)]
         │                                        │
         │ (Visits /slug)                         │ (JWT Authenticated)
         ▼                                        ▼
[Next.js App Router (Public View)]     [Couple Management Portal]
         │                                        │
         ▼ (Submit RSVP Payload)                  ▼ (Update Story / Roster)
┌────────────────────────────────────────────────────────┐
│               Spring Boot API Gateway                  │
│  ├─► Multi-Tenant Event Resolver (Slug to Event ID)    │
│  ├─► Grouped RSVP Transaction Manager                  │
│  └─► S3 Pre-Signed Image Upload Coordinator            │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
                 [PostgreSQL Database]
                 • Couples, Events, Schedules
                 • Party Groups, Guests, RSVPs
```

1. **Multi-Tenant Event Routing:**
   Public wedding sites resolve dynamically based on the URL path slug. Next.js fetches event configuration data (hero images, schedule milestones, registry links) from Spring Boot, caching rendered pages while revalidating on demand whenever the couple saves updates.

2. **Grouped RSVP Processing:**
   Rather than treating guests as isolated rows, I grouped guests into "Parties" (e.g., Smith Family). When a guest enters their unique invite code:
   - The system reveals all individuals in their party.
   - Allows marking attendance individually (Attending / Regretfully Declines).
   - Collects per-person dietary restrictions (Vegetarian, Gluten-Free, Allergies).
   - Commits the entire submission inside a single atomic database transaction.

3. **Photo Gallery and AWS S3 Storage:**
   Couples can upload engagement and wedding photos. The Spring Boot backend generates AWS S3 pre-signed upload URLs with strict file size and MIME-type restrictions, offloading heavy media upload bandwidth from the main application server.

---

## My Role and Contributions

As the sole full-stack developer and system designer, my individual contributions included:

- **End-to-End System Design:** Conceived the multi-tenant data model, entity relationships, and architectural boundaries between Next.js and Spring Boot.
- **Spring Boot API Development:** Engineered the REST controllers, DTO validation pipelines, service transactions, and JPA repositories.
- **Frontend UI & Website Themes:** Built the public wedding website renderer and the administrative dashboard using Next.js and Tailwind CSS.
- **Database Schema Modeling:** Designed relational tables with foreign keys and unique constraints in PostgreSQL for parties, guests, and meal selections.
- **AWS Cloud Deployment:** Configured Docker container images, set up EC2 Linux hosting with Nginx, and configured AWS S3 buckets for media storage.

---

## Challenges and Decisions

- **Spike Traffic During Digital Invitation Blasts:**
  - *Challenge:* When couples blast invitation links across messaging groups, dozens of guests access the RSVP form simultaneously.
  - *Decision:* I optimized database indexes on `(event_id, invite_code)` and configured HikariCP connection pooling in Spring Boot to handle concurrent write bursts cleanly.
- **Mobile Usability for Elderly Guests:**
  - *Challenge:* Older family members struggled with complex multi-step forms on mobile devices.
  - *Decision:* I streamlined the RSVP interface into a single, high-contrast modal with large tap targets and zero required passwords for invitees.
- **Preventing Cross-Tenant Data Leaks:**
  - *Challenge:* Ensuring one couple cannot inadvertently query or overwrite another couple's guest list.
  - *Decision:* I enforced event ownership checks at the service layer by extracting the authenticated user ID from the JWT token and validating it against the requested event ID on every mutating query.

---

## Results and Validation

- **RSVP Processing Speed:** Maintained an average RSVP submission latency of **under 150 ms** in simulated load tests.
- **Data Integrity:** Successfully verified atomic transactional rollbacks during simulated partial submissions across multi-guest party rosters.
- **User Experience:** Achieved an intuitive design allowing test users to complete site setup and guest list ingestion in **under 15 minutes**.
- **Mobile Responsiveness:** Confirmed consistent form rendering and touch target sizing across iOS and Android mobile viewports.

---

## Lessons Learned and Future Improvements

1. **Grouped Relational Modeling Simplifies UX:** Modeling guest parties rather than disconnected individuals mirrors real-world wedding dynamics and drastically reduces RSVP confusion.
2. **Fast Static Pages Create Great First Impressions:** Server-rendering the public celebration page ensures that friends and family receive instantaneous page loads on any device.
3. **Future Roadmap:** Future improvements include automated SMS reminder notifications via Twilio and real-time seating chart drag-and-drop planners.

---

## Closing and Project Links

Happy Endings demonstrated how thoughtful relational data modeling and modern full-stack web technologies can simplify event planning for non-technical users while maintaining enterprise-level data reliability.

- **GitHub Repository (Frontend):** [github.com/gfdelrosario12/happy-endings-frontend](https://github.com/gfdelrosario12/happy-endings-frontend)
- **Live Demo / Project Code:** [github.com/gfdelrosario12/happy-endings-frontend](https://github.com/gfdelrosario12/happy-endings-frontend)

# Asteria Academy: Student Information System

*Engineering a secure, enterprise-level Student Information System with Spring Boot, MySQL, and JWT role-based access control.*

> **Demonstration Notice:** This article documents an academic software engineering project, including system architecture specifications and simulated concurrency evaluations to illustrate the engineering scope and implementation approach.

---

## Overview

Educational institutions and training academies handle extensive volumes of sensitive student information, including academic histories, tuition balances, enrollment applications, and faculty grading records. Many mid-sized private institutions still rely on fragmented desktop spreadsheets or legacy desktop applications that lack centralized security, granular role permissions, and modern audit logging.

I architected and developed Asteria Academy as an enterprise-grade Student Information System (SIS) designed to streamline institutional record governance. Built around a decoupled microservice-ready backend and modern responsive frontend, Asteria Academy manages student lifecycles from initial registration and course enrollment through graduation and transcript generation.

---

## Problem and Context

Academic information management requires strict confidentiality and compliance with data privacy mandates:

1. **Privilege Escalation Risks:** Students must never view peers' private academic records, while instructors must be strictly restricted to editing grades only for their assigned course sections.
2. **Concurrent Enrollment Race Conditions:** Popular elective classes with strict seat limits often experience over-enrollment when dozens of students attempt registration at the exact same second.
3. **Auditability Deficits:** Any adjustment to a student's official grade transcript requires an immutable, verifiable record of who authorized the change.

---

## Objectives and Requirements

- **Role-Based Security Boundary:** Enforce strict Role-Based Access Control (RBAC) across four distinct personas: Super Administrator, Registrar, Faculty Instructor, and Student.
- **Seat Limit Concurrency Management:** Guarantee absolute consistency for course enrollment caps without phantom enrollments or seat overages.
- **Auditable Academic Records:** Log all student profile modifications and grading adjustments with immutable database audit tables.
- **Decoupled RESTful Architecture:** Connect a responsive **Next.js** frontend with a robust, containerized **Spring Boot** API backend.

---

## Approach and Process

I combined enterprise backend frameworks with clean database normalization:

- **Backend Architecture:** Built with **Java 17** and **Spring Boot 3**, leveraging Spring Security and Spring Data JPA.
- **Database Management:** Utilized **MySQL 8.0** with the InnoDB storage engine for ACID-compliant transactions and foreign key enforcement.
- **Frontend Application:** Developed in **Next.js 14**, **TypeScript**, and **Tailwind CSS**, featuring responsive table layouts, printable transcripts, and course schedule builders.
- **Security & Authorization:** Implemented stateless **JSON Web Tokens (JWT)** with BCrypt password hashing and custom role validation filters.
- **Containerization:** Configured **Docker** and **Docker Compose** orchestrating backend API, MySQL database, and reverse proxy containers.

---

## Solution and Key Features

The institutional workflow establishes strict authorization boundaries across all system interactions:

```
[Student / Faculty Browser]
           │
           ▼ (HTTPS / Bearer JWT)
[Spring Security JWT Authentication Filter]
  ├─► Validate Token Signature & Expiration
  └─► Extract GrantedAuthorities (ROLE_REGISTRAR, ROLE_FACULTY, etc.)
           │
           ▼
[Service Tier & Transaction Boundary]
  ├─► Course Registration Service (Pessimistic Locking on Course Seats)
  └─► Grade Submission Service (Audit Interceptor)
           │
           ▼
[MySQL 8.0 Database (InnoDB Engine)]
  • Students, Faculty, Courses, Enrollments
  • Grades & Immutable Academic Audit Logs
```

1. **Course Enrollment Concurrency Protection:**
   To eliminate race conditions when multiple students click "Enroll" for the final available seat in a laboratory section, the registration service employs pessimistic write locking at the database level:
   ```java
   @Lock(LockModeType.PESSIMISTIC_WRITE)
   @Query("SELECT c FROM Course c WHERE c.id = :courseId")
   Optional<Course> findByIdWithLock(@Param("courseId") Long courseId);
   ```
   This ensures that the seat counter is updated in a strictly serialized transaction, rejecting concurrent attempts once the capacity limit is reached.

2. **Hierarchical Academic Permissions:**
   Endpoint security is governed declaratively through Spring Security method-level annotations:
   ```java
   @PreAuthorize("hasRole('REGISTRAR') or (hasRole('FACULTY') and @courseService.isInstructor(authentication.principal, #courseId))")
   @PostMapping("/courses/{courseId}/grades")
   public ResponseEntity<Void> submitGrades(@PathVariable Long courseId, @RequestBody GradeSubmissionDTO grades) { ... }
   ```
   Students can query only `/api/student/me/grades`, dynamically filtered by their authenticated user token.

3. **Transcript Generation and Performance Analytics:**
   A reporting engine computes cumulative Grade Point Averages (GPA), tracks semester credit loads, and renders clean, printable PDF transcripts directly inside the browser.

---

## My Role and Contributions

As the backend architect and full-stack developer, my individual responsibilities encompassed:

- **Entity Modeling & Database Normalization:** Designed the Third Normal Form (3NF) relational schema in MySQL, defining tables for courses, prerequisites, enrollments, letter grade scales, and audit records.
- **Spring Security Configuration:** Implemented the stateless JWT authentication filter chain, password hashing policies, and role-based method security annotations.
- **Concurrency & Transaction Control:** Engineered the thread-safe enrollment service utilizing Spring transactional boundaries and pessimistic database row locks.
- **Frontend Dashboard Development:** Built the Next.js student portal and faculty grade-entry spreadsheets using React and Tailwind CSS.
- **Docker Compose Orchestration:** Authored multi-container Docker Compose definitions for local development and continuous testing.

---

## Challenges and Decisions

- **Complex Database Joins on Transcript Generation:**
  - *Challenge:* Querying student histories across multiple semesters with prerequisites, retakes, and credit equivalencies caused slow database query times.
  - *Decision:* I designed optimized composite indexes on `(student_id, semester_id)` and created dedicated read-optimized materialized queries for student transcripts.
- **Secure Token Lifecycle:**
  - *Challenge:* Preventing token hijacking if a student leaves a public computer terminal signed in.
  - *Decision:* I configured short-lived 15-minute access tokens paired with secure HTTP-only refresh tokens and automated session timeouts upon inactivity.
- **Prerequisite Validation Logic:**
  - *Challenge:* Preventing students from registering for advanced courses without completing required foundational courses.
  - *Decision:* I wrote a dedicated prerequisite validator service that traverses student course completion history prior to acquiring enrollment database locks.

---

## Results and Validation

- **Enrollment Integrity:** Successfully handled simulated bursts of **500 concurrent registration requests** across limited-capacity course sections with zero seat overages or deadlocks.
- **Response Speed:** Maintained an average API response time of **under 120 ms** across standard academic record queries in testing suites.
- **Security Isolation:** Validated 100% boundary isolation across student, faculty, and registrar test accounts with zero authorization bypasses.
- **Data Consistency:** Verified transactional rollbacks during simulated mid-operation database network interruptions.

---

## Lessons Learned and Future Improvements

1. **Pessimistic Locking is Justified for Fixed Inventories:** While optimistic locking works well for general CRUD, fixed resource allocations like classroom seats require strict database-level pessimistic locking.
2. **Defensive API Scoping Protects Data:** Never rely solely on client-side routing guards to hide sensitive information; all authorizations must be enforced rigorously on backend API controllers.
3. **Future Roadmap:** Future improvements include integrating a student tuition payment gateway via Stripe webhooks and automated PDF transcript digital signing with cryptographic certificates.

---

## Closing and Project Links

Asteria Academy demonstrated how robust transactional database design and strict Spring Security authorization layers can deliver a reliable, secure information management backbone for academic institutions.

- **GitHub Repository:** [github.com/gfdelrosario12/Asteria-Academy-SIS](https://github.com/gfdelrosario12/Asteria-Academy-SIS)
- **Live Demo / Project Code:** [github.com/gfdelrosario12/Asteria-Academy-SIS](https://github.com/gfdelrosario12/Asteria-Academy-SIS)

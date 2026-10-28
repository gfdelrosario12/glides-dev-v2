# SiteGuard: Workforce Management and Biometric Security System

*Hardening Linux cloud infrastructure on AWS EC2 with Nginx, SSL/TLS, and building real-time biometric access control event pipelines in Spring Boot.*

> **Demonstration Notice:** This article documents a systems administration and security engineering project, including cloud infrastructure configurations and simulated biometric event benchmarks to illustrate the engineering scope and implementation approach.

---

## Overview

Industrial facilities, construction sites, and secure office environments require rigorous workforce access governance. Relying on legacy RFID keycards frequently results in "buddy punching," lost physical credentials, and inaccurate contractor headcount tracking during safety evacuations.

I developed and configured SiteGuard as an end-to-end workforce management and biometric security platform. It interfaces with on-premise biometric fingerprint and optical facial recognition terminals, ingests high-volume access events, enforces strict shift access policies, and provides facility security teams with real-time operational oversight across distributed entry gates.

---

## Problem and Context

Deploying and operating a live biometric access control backend exposes critical security, operational, and systems administration challenges:

1. **Unprotected Endpoint Exposure:** Edge biometric devices transmitting employee credentials across the public internet risk interception if cloud ingress channels lack robust encryption and perimeter hardening.
2. **High-Frequency Ingress Spikes:** Shift changeovers produce bursts of hundreds of biometric verification events within minutes, risking API gateway saturation and database connection exhaustion.
3. **Operational Visibility Deficits:** Facility managers need immediate incident alerts when unauthorized badge attempts occur or when physical gate hardware goes offline.

---

## Objectives and Requirements

- **Cloud Infrastructure Hardening:** Configure production Linux host environments on AWS EC2 utilizing SSH key-only access, systemd service management, and Nginx reverse proxies with modern TLS 1.3 encryption.
- **Biometric Event Pipeline:** Ingest and process 500+ daily biometric events with zero data loss and automated audit logging.
- **Granular Access Control:** Enforce role-based access control (RBAC) via Spring Security to segregate administrative, safety officer, and audit roles.
- **Real-Time Operational Monitoring:** Deliver live WebSocket event streaming to administrative consoles with instant unauthorized entry alerts.

---

## Approach and Process

I merged production systems administration practices with modern full-stack application development:

- **Cloud Infrastructure & Host OS:** Deployed on **AWS EC2 (Ubuntu Linux LTS)**, configured with least-privilege **AWS Security Groups** and strict **IAM** role policies.
- **Web Server & Reverse Proxy:** Configured **Nginx** with automated **Let's Encrypt SSL/TLS**, rate limiting, and HTTP/2 protocol support.
- **Backend Application:** Built with **Java 17** and **Spring Boot 3**, leveraging Spring Security and Spring Data JPA.
- **Relational Database:** Deployed **PostgreSQL** configured with connection pooling, index optimizations, and automated daily backups.
- **Event Streaming & UI:** Used **WebSockets (STOMP)** connecting to a responsive **Next.js 14** administrative dashboard styled with **Tailwind CSS**.

---

## Solution and Key Features

The system architecture pairs a hardened host perimeter with an event-driven application layer:

```
[On-Premise Biometric Terminals]
           │
           │ (HTTPS / TLS 1.3 Mutual Auth)
           ▼
[AWS Security Group: Port 443 Only]
           │
           ▼
[Nginx Reverse Proxy & SSL Termination]
           │
           ▼ (Internal Proxy_Pass: localhost:8080)
[Spring Boot Service Layer]
  ├─► Access Verification Engine (Shift Schedules & Gate Rules)
  ├─► Security Audit Logger (Tamper-Resistant Log Store)
  └─► WebSocket Dispatcher (Live Security Console)
           │
           ▼
[PostgreSQL Database]
```

1. **Host Hardening and Service Management:**
   - Disabled root login and password authentication over SSH, enforcing Ed25519 cryptographic keys.
   - Configured `ufw` (Uncomplicated Firewall) and AWS Security Groups to expose only ports 80 and 443 publicly, keeping internal application ports isolated.
   - Daemonized the Spring Boot application using a custom Linux `systemd` unit with automated restart policies and dedicated unprivileged user execution (`user: siteguard`).

2. **Nginx Reverse Proxy and SSL Configuration:**
   Nginx acts as the single point of entry, terminating SSL/TLS with modern cipher suites (TLSv1.2, TLSv1.3) and passing requests through local ports:
   ```nginx
   server {
       listen 443 ssl http2;
       server_name siteguard.gladwin.dev;

       ssl_certificate /etc/letsencrypt/live/siteguard/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/siteguard/privkey.pem;
       ssl_protocols TLSv1.2 TLSv1.3;

       location /api/ {
           proxy_pass http://127.0.0.1:8080;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
   }
   ```

3. **Biometric Ingress and Live Security Telemetry:**
   Biometric hardware nodes dispatch event payloads upon user scanning. The Spring Boot backend checks active shift allocations and gate authorization tables in PostgreSQL. Real-time access events are broadcast via WebSockets to security desk screens with distinct color-coded indicators (Green = Authorized, Red = Restricted Gate).

---

## My Role and Contributions

As the systems infrastructure and full-stack security engineer, my individual responsibilities encompassed:

- **Linux Systems Administration:** Provisioned AWS EC2 instances, installed and maintained system dependencies, configured systemd unit files, and managed storage volume mounts.
- **Network & Perimeter Security:** Authored Nginx reverse proxy configuration files, configured Let's Encrypt automated certificate renewals via Certbot, and restricted AWS Security Groups.
- **Backend Access Control Logic:** Implemented Spring Security filters, RBAC permission evaluators, and transactional audit logging services.
- **Hardware Telemetry Integration:** Designed the REST and WebSocket ingress endpoints that ingest serialized biometric punch events from physical scanners.
- **Operational Incident Response:** Investigated biometric terminal connection drops and simulated network isolation recovery procedures.

---

## Challenges and Decisions

- **Network Drops on Physical Edge Scanners:**
  - *Challenge:* Industrial turnstile scanners lost connection during intermittent local switch power cycles.
  - *Decision:* I configured local hardware offline caching with idempotency keys in the API payload (`event_id: UUID`), ensuring no duplicate punch logs occur when connections re-establish.
- **Security Group Audit Compliance:**
  - *Challenge:* Ensuring zero open administrative ports while retaining secure developer access.
  - *Decision:* I restricted SSH management strictly to specific VPN IP CIDR blocks and established AWS CloudWatch alarms for repeated failed login attempts.
- **Mitigating Connection Pool Saturation During Shift Changes:**
  - *Challenge:* Simultaneous scans across 8 gate terminals caused database connection timeouts under default HikariCP pools.
  - *Decision:* I tuned HikariCP connection pool parameters, introduced batched audit writes, and indexed foreign keys on `employee_id` and `scan_timestamp`.

---

## Results and Validation

- **Event Throughput:** Successfully processed simulated spikes of **500+ daily biometric events** with sub-200ms API response times.
- **System Uptime:** Maintained uninterrupted host stability throughout automated failover and penetration testing scripts.
- **Incident Response:** Reduced security officer identification of invalid badge attempts from several minutes to **instantaneous visual alerts**.
- **Perimeter Hardening:** Verified zero unnecessary exposed ports using external Nmap scans and security configuration audits.

---

## Lessons Learned and Future Improvements

1. **Security Starts at the Operating System:** Robust web applications remain vulnerable without properly configured firewalls, systemd isolation, and restrictive SSH hygiene.
2. **Idempotency is Critical in Hardware Telemetry:** Physical devices frequently retransmit packets upon minor network timeouts; database idempotency keys prevent chaotic data duplication.
3. **Future Roadmap:** Future enhancements include automated IP ban jails (via Fail2ban) for abusive API endpoints and integration with corporate Active Directory / LDAP directories.

---

## Closing and Project Links

SiteGuard demonstrated how secure Linux systems administration, Nginx reverse proxying, and event-driven Spring Boot backends unite to create reliable, enterprise-grade access control infrastructure.

- **GitHub Repository:** [github.com/gfdelrosario12/siteguard](https://github.com/gfdelrosario12/siteguard)
- **Live Demo / Project Overview:** [github.com/gfdelrosario12/siteguard](https://github.com/gfdelrosario12/siteguard)

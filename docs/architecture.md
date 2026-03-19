# Software Architecture Document

## Overview

Sistem ini dirancang menggunakan pola **Modular Monolith** dalam struktur **Monorepo**. Tujuan utamanya adalah menjaga kecepatan pengembangan di awal, namun siap untuk dipecah menjadi microservices (atau service terpisah) ketika trafik meningkat.

## High-Level Diagram

flowchart TD
User["Customer"] -->|HTTPS| CDN["CDN / Edge"]
CDN --> LB["Load Balancer / Nginx"]

    subgraph APP["Application Cluster"]
        LB --> CustomerWeb["Next.js App (SSR/CSR)"]
        LB --> AdminWeb["React SPA (CSR)"]

        CustomerWeb -->|REST API| API["Backend API Cluster"]
        AdminWeb -->|REST API| API
    end

    subgraph DATA["Data & Async Layer"]
        API -->|Read/Write| DB[(PostgreSQL Primary)]
        API -->|Read| DBReplica[(PostgreSQL Replica)]
        API -->|Cache/Queue| Redis[(Redis Cluster)]

        API -->|Produce Job| Queue["Message Queue"]
        Worker["Background Worker"] -->|Consume Job| Queue
    end

    subgraph EXT["External Services"]
        API --> Cloudinary["Image Storage"]
        Worker --> SMTP["Email Provider"]
    end

## Core Components

1. API Service (Express.js): Menangani logika bisnis, validasi, dan autentikasi. Stateless.
2. Background Worker: Proses terpisah yang menangani tugas berat (Email, Generate Laporan, Expire Transactions). Menggunakan Redis sebagai broker.
3. Database (PostgreSQL): Single source of truth. Menggunakan Prisma ORM.
4. Client (Next.js & React): Mengkonsumsi API.

## Key Decisions

- Monorepo: Memudahkan sharing types (TypeScript) antara Backend dan Frontend. Jika Backend update DTO, Frontend langsung error saat compile (Fail Fast).
- Stateless Auth: JWT digunakan untuk skalabilitas horizontal API.
- Upload Strategy: Menggunakan Signed URL atau Stream Upload ke Cloudinary untuk menghindari beban I/O pada Node.js server.

# Event Management Platform - Backend API

Platform manajemen acara yang memungkinkan penyelenggara acara untuk membuat dan mempromosikan acara, sementara peserta dapat menelusuri dan mendaftar untuk acara tersebut.

## 🚀 Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **File Upload**: Cloudinary
- **Email**: Nodemailer

## 📋 Prerequisites

- Node.js v18 or higher
- PostgreSQL v14 or higher
- npm or yarn
- Cloudinary account
- SMTP email service (Gmail, etc.)

## 🛠️ Installation

- npm install

### 1. Clone the repository

```bash
git clone https://github.com/umbara-web/event-platform.git
cd event-platform/apps/api
```

## Setup database

# Generate Prisma client

- npm run db:generate

# Run migrations

- npm run db:migrate

# Seed database (optional)

- npm run db:seed

## Start development server

- npm run dev

## Start worker

- npm run dev:worker

## Start all

- npm run dev:all

## Run tests

- npm run test

## Run lint

- npm run lint

## Run build

- npm run build

## Run start

- npm run start

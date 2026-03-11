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
git clone <repository-url>
cd event-management-platform/apps/api
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

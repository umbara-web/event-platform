# Event Management Platform - Frontend

Frontend web application untuk Platform Manajemen Acara menggunakan Next.js 16.

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios

## 📋 Prerequisites

- Node.js v18 or higher
- npm or yarn
- Backend API running

## 🛠️ Installation

### 1. Install dependencies

```bash
cd frontend/web
npm install
```

## Run development server

```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── app/                   # Next.js App Router pages
│   ├── (auth)/            # Auth pages (login, register)
│   ├── (main)/            # Public pages
│   ├── (protected)/       # Customer protected pages
│   └── dashboard/         # Organizer dashboard
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components
│   ├── auth/              # Auth forms
│   ├── events/            # Event components
│   ├── transactions/      # Transaction components
│   ├── dashboard/         # Dashboard components
│   └── shared/            # Shared components
├── hooks/                 # Custom React hooks
├── lib/
│   ├── api/               # API functions
│   └── utils.ts           # Utility functions
├── stores/                # Zustand stores
└── types/                 # TypeScript types
```

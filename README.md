# 🚀 Multi-User PERN Blog Platform

> **A high-performance, modular, and beautiful Multi-User Publishing & Blogging Platform** built with PostgreSQL, Express, React, Node.js, TypeScript, and Prisma 7.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg?style=flat-square&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg?style=flat-square&logo=react)](https://reactjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.10.0-2D3748.svg?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg?style=flat-square&logo=vite)](https://vitejs.dev/)

---

## ✨ Features & Highlights

* 🏢 **Multi-User Architecture**: Every creator gets their own unique personal blog profile (`/@:username`) and dedicated post routes (`/@:username/:postSlug`).
* ✍️ **Ghost-Style Creator Studio**: Minimalist, distraction-free rich text editor with sliding settings drawer, tag management, cover image upload, and debounced auto-save.
* 📖 **Overreacted & Substack Aesthetics**: Clean, readable typography, dark mode-ready CSS tokens, and responsive glassmorphism navigation.
* 📊 **Smart Analytics Engine**: 60-minute view deduplication window powered by SHA-256 reader fingerprinting (Cookie + IP + User-Agent).
* 🔒 **Secure Auth & Session**: HttpOnly, SameSite JWT cookies with Zod request validation and strict TypeScript types.
* 📦 **Modern Monorepo**: Centralized `.env` architecture with `concurrently` tooling for simultaneous backend and frontend development.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, TanStack Query v5, React Router v6, React Hook Form, Lucide React, Custom CSS Design System |
| **Backend** | Express.js, TypeScript, Prisma 7.10.0, `@prisma/adapter-pg`, PostgreSQL (`pg` pool), Zod, Multer, Bcryptjs, JWT |
| **Database** | PostgreSQL 16 (Local / Docker Compose / Cloud) |
| **DevOps & Tools** | Docker Compose, Concurrently, Graphify Knowledge Graph, ESLint |

---

## 📂 Project Structure

```
belajar-pern/
├── docs/                        # 📚 Complete System Documentation
│   ├── 01-PRD.md                # Product Requirements & Feature Specs
│   ├── 02-ARCHITECTURE_AND_STANDARDS.md  # Clean Architecture & MVP Pattern
│   ├── 03-DATABASE.md           # PostgreSQL Schema & Prisma 7 ERD
│   ├── 04-API_SPECS.md          # REST API Endpoints Contract
│   ├── 05-DESIGN_AND_UIUX.md    # CSS Variables, Design Tokens & Fonts
│   ├── 06-SETUP_AND_RUN.md      # Setup, Run, & Environment Guide
│   └── 07-TASK_BREAKDOWN.md     # Development Milestones & Task List
├── backend/                     # ⚙️ Express Backend Application
│   ├── prisma/                  # Prisma Schema & Migrations
│   │   └── schema.prisma        # Database Models
│   ├── prisma.config.ts         # Prisma 7 Central Datasource Config
│   └── src/
│       ├── config/              # Prisma Client & App Config
│       ├── middlewares/         # Auth, Error & Upload Middlewares
│       ├── modules/             # Auth, Posts, Analytics, Media Modules
│       └── index.ts             # Express Entry Point
├── frontend/                    # 🎨 React + Vite Frontend Application
│   └── src/
│       ├── app/                 # Router, Providers & App Entry
│       ├── features/            # Auth, Dashboard, Creator & Reader
│       ├── shared/              # API Client & Reusable UI Components
│       └── styles/              # Design Tokens, Reset & Global CSS
├── .env.example                 # Environment Template
├── package.json                 # Monorepo Orchestration Scripts
└── README.md                    # Project Overview
```

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/FatihSafaat28/blogapp-fullstack.git
cd blogapp-fullstack

# Install all dependencies (Root, Backend, & Frontend)
npm install
npm --prefix backend install
npm --prefix frontend install
```

### 2. Configure Environment Variables
Copy the `.env.example` file to create your root `.env`:
```bash
cp .env.example .env
```
Update your database credentials in `.env`:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/belajar_pern_blog?schema=public"
JWT_SECRET="super-secret-jwt-key"
CLIENT_URL="http://localhost:5173"
```

### 3. Database Migration & Prisma Client
```bash
# Generate Prisma 7 Client
npm run prisma:generate

# Run initial migration (requires PostgreSQL running)
cd backend && npx prisma migrate dev --name init
```

### 4. Run Development Server
Run both Backend (`localhost:5000`) and Frontend (`localhost:5173`) concurrently:
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

---

## 📖 Detailed Documentation

For full architectural blueprints, database schemas, and engineering standards:
* 📄 [Master Documentation Index](docs/README.md)
* 📋 [Product Requirements Document (PRD)](docs/01-PRD.md)
* 📐 [Engineering Standards & Architecture](docs/02-ARCHITECTURE_AND_STANDARDS.md)
* 🗄️ [Database Schema & ERD](docs/03-DATABASE.md)
* 🔌 [API Specification](docs/04-API_SPECS.md)
* 🎨 [Design System & UI/UX Guidelines](docs/05-DESIGN_AND_UIUX.md)

---

## 📄 License
This project is open-sourced under the [MIT License](LICENSE).

# AXON Medical Platform — Backend API

> A comprehensive healthcare management system backend built with Node.js, Express, and MongoDB. Designed for graduation project — connects patients and doctors with AI-powered drug interaction checking, AI medical chatbot, real-time chat, medication tracking, and emergency medical QR codes.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Medications](#medications)
  - [Appointments](#appointments)
  - [Chat](#chat)
  - [Posts & Community](#posts--community)
  - [Medical Records](#medical-records)
  - [DDI (Drug Interaction)](#ddi-drug-interaction)
  - [Notifications](#notifications)
  - [Prescriptions](#prescriptions)
  - [AI ChatBot](#ai-chatbot)
- [Models](#models)
- [Security](#security)
- [Testing](#testing)
- [Deployment](#deployment)
- [License](#license)

---

## Overview

AXON is a medical platform that bridges the gap between patients and healthcare providers. The backend provides a RESTful API with WebSocket support for real-time features, supporting both Arabic and English with RTL capabilities.

**Key Capabilities:**
- Dual-role system: **Patients** and **Doctors**
- Medication tracking with dose logging
- Appointment booking with real-time chat
- AI-powered drug-drug interaction (DDI) checking via dedicated AI service
- AI medical chatbot with OpenRouter (primary) and Gemini (fallback)
- Emergency medical QR codes for first responders
- Community posts and doctor articles
- File uploads (medical images, certificates, profile photos)

---

## Features

| Module | Description |
|--------|-------------|
| **Authentication** | JWT-based auth with access/refresh tokens, password reset via email |
| **User Management** | Role-based access, doctor verification, patient health profiles |
| **Medications** | Create, track, and log medication doses with auto-generated intake schedules |
| **Appointments** | Book, accept/reject, cancel appointments; auto-create chat on acceptance |
| **Chat** | Real-time messaging via Socket.io tied to appointments |
| **Posts** | Doctors publish articles; patients create community posts with comments/likes |
| **Medical Records** | Patient health profiles with radiology/lab test uploads |
| **Emergency QR** | Generate scannable QR codes with vital medical info for emergencies; PIN-protected with access logging |
| **DDI Checker** | AI service integration for drug interaction and contraindication checking (patient self-check and doctor patient-check) |
| **AI ChatBot** | Bilingual medical AI assistant using OpenRouter (GPT-4o-mini) with Gemini fallback; supports general and personalized (patient-context-aware) queries |
| **Notifications** | In-app notification system with unread counts |
| **i18n** | Bilingual support (Arabic/English) with automatic language detection |
| **File Uploads** | Secure multipart uploads with temp-to-final routing and cleanup |
| **Logging** | Structured logging with Pino, file rotation, and retention policies |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | Node.js 20+ (ES Modules) |
| **Framework** | Express.js 5.x |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **Validation** | Zod |
| **Real-time** | Socket.io 4.x |
| **File Uploads** | Multer (diskStorage) |
| **Logging** | Pino + pino-pretty |
| **Email** | Nodemailer |
| **Security** | Helmet, CORS, HPP, rate-limiting, input sanitization (body `$`-prefix stripping) |
| **Compression** | compression (gzip, threshold 1KB) |
| **QR Codes** | qrcode |
| **AI ChatBot** | OpenRouter API (GPT-4o-mini) + Google Gemini fallback |
| **Testing** | Jest + Supertest + MongoDB Memory Server |
| **Deployment** | Koyeb |

---

## Project Structure

```
backend/
├── server.js                 # Entry point — DB connect, server start, graceful shutdown
├── app.js                    # Express app setup — middleware, routes, health check, sanitization
├── jest.config.mjs           # Jest ESM configuration
├── package.json
├── .env                      # Environment variables (not in repo)
├── .env.example              # Environment template
├── uploads/                  # Static file storage
│   ├── certificates/
│   ├── personalPhoto/
│   ├── radiology/
│   ├── labTests/
│   ├── posts/
│   ├── articles/
│   └── .temp/                # Temporary upload staging
├── logs/                     # Pino log files (app.log, error.log)
├── postman/                  # Postman collection + environment files
├── report/                   # Audit reports
├── reports/                  # Test coverage reports (HTML)
├── src/
│   ├── config/
│   │   ├── db.js             # MongoDB connection with retry logic
│   │   ├── env.js            # Environment variable validation
│   │   ├── logger.js         # Pino logger with rotation & cleanup
│   │   └── socket.js         # Socket.io initialization & auth
│   ├── controllers/          # Request handlers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── medicationController.js
│   │   ├── appointmentController.js
│   │   ├── chatController.js
│   │   ├── postController.js
│   │   ├── recordController.js
│   │   ├── ddiController.js
│   │   ├── notificationController.js
│   │   ├── prescriptionController.js
│   │   └── chatbotController.js
│   ├── services/             # Business logic layer
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── medicationService.js
│   │   ├── appointmentService.js
│   │   ├── chatService.js
│   │   ├── postService.js
│   │   ├── recordService.js
│   │   ├── ddiService.js
│   │   ├── notificationService.js
│   │   ├── tokenService.js
│   │   ├── fileService.js
│   │   └── chatbotService.js
│   ├── models/               # Mongoose schemas
│   │   ├── User.js
│   │   ├── Patient.js
│   │   ├── Medication.js
│   │   ├── DoseLog.js
│   │   ├── Appointment.js
│   │   ├── Conversation.js
│   │   ├── Message.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   ├── Like.js
│   │   ├── Notification.js
│   │   ├── BotConversation.js
│   │   └── BotMessage.js
│   ├── routes/               # API route definitions
│   │   ├── index.js          # Route aggregator (/api/v1/...)
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── medicationRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── postRoutes.js
│   │   ├── recordRoutes.js
│   │   ├── ddiRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── prescriptionRoutes.js
│   │   └── chatbotRoutes.js
│   ├── middlewares/
│   │   ├── auth.js           # JWT protection + role restriction
│   │   ├── validate.js       # Zod body validation
│   │   ├── ValidateObjectId.js
│   │   ├── errorHandler.js   # Global error handler
│   │   ├── i18n.js           # Language detection middleware
│   │   ├── parseUniversal.js # Universal parser (JSON/form-data/multipart)
│   │   ├── socketAuth.js     # JWT validation for Socket.io connections
│   │   └── upload.js         # Multer config + file movement helpers
│   ├── validators/           # Zod schemas
│   │   ├── authValidator.js
│   │   ├── medicationValidator.js
│   │   └── chatbotValidator.js
│   ├── utils/
│   │   ├── AppError.js       # Custom error class
│   │   ├── catchAsync.js     # Async wrapper for controllers
│   │   ├── i18n.js           # Localization helpers
│   │   ├── response.js       # Standardized response formatter
│   │   └── transformers.js   # Data transformation utilities
│   └── public/               # Static HTML pages
│       ├── emergency-view.html  # Emergency QR viewer page
│       └── viewer.html         # QR studio viewer
└── tests/                    # Jest test suite
    ├── setup.js
    ├── teardown.js
    ├── auth.test.js
    ├── user.test.js
    ├── medication.test.js
    ├── appointment.test.js
    ├── post.test.js
    ├── record.test.js
    ├── chat.test.js
    ├── ddi.test.js
    ├── notification.test.js
    ├── health.test.js
    ├── integration.test.js
    └── covrage.test.js
```

---

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- MongoDB Atlas cluster (or local MongoDB)
- AI DDI service running (optional — falls back to manual review)
- OpenRouter API key (for AI ChatBot)
- Gemini API key (for AI ChatBot fallback)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd backend

# Install dependencies
npm install

# Create environment file from template
cp .env.example .env
# Edit .env with your values

# Start development server
npm run dev

# Or production
npm start
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
# ============================================
# AXON Medical API — Environment Configuration
# ============================================

# Server
NODE_ENV=development
PORT=3000

# Database (MongoDB Atlas)
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority&appName=<AppName>

# JWT
JWT_SECRET=<your-jwt-secret-here>
REFRESH_SECRET=<your-refresh-secret-here>
JWT_EXPIRES_IN=15m
REFRESH_EXPIRES_IN=7d

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<your-email@gmail.com>
EMAIL_PASS=<your-app-password>
EMAIL_FROM=<your-email@gmail.com>

# App
APP_URL=http://localhost:3000

# Logger
LOG_LEVEL=info
LOG_RETENTION_DAYS=30
LOG_MAX_SIZE_MB=100
LOG_ROTATION_SIZE_MB=50
LOG_ROTATION_COUNT=5

# CORS
ALLOWED_ORIGINS=http://localhost:3000

# AI DDI Service
AI_DDI_SERVICE_URL=http://localhost:5001/api/predict-ddi-batch

# AI ChatBot
OPENROUTER_API_KEY=<your-openrouter-api-key>
GEMINI_API_KEY=<your-gemini-api-key>
CHATBOT_MODEL=gpt-4o-mini
GEMINI_FALLBACK_MODEL=gemini-1.5-flash
```

**Additional optional variables:**
- `DB_MAX_RETRIES` — MongoDB connection retries (default: 5)
- `DB_RETRY_DELAY_MS` — Delay between retries (default: 5000)
- `DB_CONNECT_TIMEOUT_MS` — Connection timeout (default: 10000)
- `DB_MAX_POOL_SIZE` — Max connection pool size (default: 50)
- `DB_MIN_POOL_SIZE` — Min connection pool size (default: 10)
- `UPLOAD_DIR` — Upload directory path (default: `./uploads`)

**Production values:**
```env
NODE_ENV=production
APP_URL=https://tender-morna-axon-fp-b76b6646.koyeb.app/
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

---

## API Documentation

Base URL: `https://tender-morna-axon-fp-b76b6646.koyeb.app/api/v1`

### Authentication

| Method | Endpoint | Rate Limit | Description |
|--------|----------|------------|-------------|
| POST | `/auth/signup/patient` | 10/15min | Register a new patient (supports multipart for photos) |
| POST | `/auth/signup/doctor` | 10/15min | Register a new doctor (requires license image) |
| POST | `/auth/login` | 5/15min | Login with email/password |
| POST | `/auth/logout` | — | Clear auth cookies |
| POST | `/auth/refresh` | 10/15min | Rotate access/refresh tokens |
| POST | `/auth/forgot-password` | 10/15min | Request password reset code |
| POST | `/auth/reset-password` | 10/15min | Reset password with code |

### Users

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/users/doctors` | — | — | List all verified doctors (paginated) |
| GET | `/users/doctors/search` | — | — | Search doctors by name/specialization |
| GET | `/users/doctors/:id` | — | — | Get doctor public profile |
| GET | `/users/patients/:id` | — | — | Get patient public profile |
| GET | `/users/me` | ✓ | — | Get full authenticated user profile |
| PATCH | `/users/me` | ✓ | — | Update profile (supports photo upload) |

### Medications

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/medications` | ✓ | doctor | Prescribe medication to patient |
| POST | `/medications/self` | ✓ | patient | Self-prescribe medication |
| GET | `/medications` | ✓ | — | Get my medications with today's dose logs |
| GET | `/medications/pending-doses` | ✓ | patient | Get next pending dose for today |
| GET | `/medications/patient/:patientId` | ✓ | doctor | Get patient's medications |
| GET | `/medications/:id` | ✓ | — | Get single medication |
| PATCH | `/medications/:id` | ✓ | — | Update medication |
| DELETE | `/medications/:id` | ✓ | — | Soft-delete medication |
| POST | `/medications/:id/doses` | ✓ | patient | Mark dose as taken/skipped |

### Appointments

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/appointments` | ✓ | patient | Book an appointment |
| GET | `/appointments/my` | ✓ | patient | Get my appointments |
| GET | `/appointments/pending` | ✓ | doctor | Get pending requests |
| GET | `/appointments/history` | ✓ | doctor | Get appointment history |
| PATCH | `/appointments/:id/status` | ✓ | doctor | Accept/reject appointment (auto-creates chat on accept) |
| PATCH | `/appointments/:id/cancel` | ✓ | patient | Cancel appointment |

### Chat

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/chat/start/:appointmentId` | ✓ | Start conversation for appointment |
| GET | `/chat/conversations` | ✓ | Get my conversations |
| GET | `/chat/:conversationId/messages` | ✓ | Get messages (marks as read) |
| POST | `/chat/:conversationId/messages` | ✓ | Send message (text or image) |

**WebSocket Events (JWT-authenticated):**
- `joinConversation` — Join a conversation room
- `newMessage` — Receive real-time messages
- `appointmentUpdated` — Receive status updates
- `newAppointment` — Doctors receive new booking alerts

### Posts & Community

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/posts/articles` | — | — | List all doctor articles |
| GET | `/posts/community` | — | — | List all community posts |
| GET | `/posts/doctor/:doctorId` | — | — | Get doctor's articles |
| GET | `/posts/:id` | — | — | Get single post (increments views) |
| GET | `/posts/:id/comments` | — | — | Get post comments |
| POST | `/posts/articles` | ✓ | doctor | Publish article (with image) |
| POST | `/posts/community` | ✓ | patient | Create community post |
| PATCH | `/posts/:id` | ✓ | — | Update own post |
| DELETE | `/posts/:id` | ✓ | — | Soft-delete own post |
| POST | `/posts/:id/like` | ✓ | patient | Toggle like |
| POST | `/posts/:id/comments` | ✓ | patient | Add comment |

### Medical Records

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/records/me` | ✓ | Get my medical record |
| PATCH | `/records/me` | ✓ | Update medical record |
| POST | `/records/tests/:type` | ✓ | Add radiology/lab test (with image) |
| POST | `/records/qr` | ✓ | Generate emergency QR code |
| GET | `/records/emergency/:token` | — | View emergency page (rate-limited: 5/15min) |
| GET | `/records/emergency-data/:token` | — | Get emergency data JSON (rate-limited) |
| GET | `/records/qr/access/:patientId` | — | Access patient record by patient ID (rate-limited) |
| GET | `/records/qr-test` | — | Open QR studio viewer HTML page |

### DDI (Drug Interaction)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/ddi/check` | ✓ | patient | Check new medication against own existing medications |
| POST | `/ddi/contraindications` | ✓ | patient | Check contraindications for self |
| POST | `/ddi/check/appointments/:appointmentId` | ✓ | doctor | Check new med against appointment patient's medications |
| POST | `/ddi/contraindications/appointments/:appointmentId` | ✓ | doctor | Check contraindications for appointment patient |
| POST | `/ddi/check-direct` | ✓ | — | Direct drug-to-drug interaction check (arbitrary drug list) |

### Notifications

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/notifications` | ✓ | Get my notifications (paginated) |
| GET | `/notifications/unread-count` | ✓ | Get unread count |
| PATCH | `/notifications/read-all` | ✓ | Mark all as read |
| PATCH | `/notifications/:id/read` | ✓ | Mark single as read |

### Prescriptions

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/prescriptions/appointment/:appointmentId` | ✓ | doctor | Prescribe from appointment |
| POST | `/prescriptions/qr` | ✓ | doctor | Prescribe via emergency QR + PIN |

### AI ChatBot

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/chatbot/ask` | ✓ | Ask a general medical question to the AI |
| POST | `/chatbot/personalized` | ✓ | Ask with patient context (blood type, conditions, allergies, active medications) |
| GET | `/chatbot/conversations` | ✓ | List chatbot conversation history |
| GET | `/chatbot/:conversationId/messages` | ✓ | Get messages in a conversation |

**ChatBot Details:**
- Primary AI: **OpenRouter** (defaults to `gpt-4o-mini`)
- Fallback: **Google Gemini** (defaults to `gemini-1.5-flash`)
- Bilingual system prompts (Arabic/English)
- Patient-aware context: loads blood type, conditions, allergies, active medications for personalized queries
- 10-second timeout per model
- Conversation history stored in MongoDB (last 20 messages used as context)

---

## Models

### User
- `fullName`, `email`, `phoneNumber`, `gender`, `password`
- `role`: `patient` | `doctor` | `admin`
- `personalPhoto`, `preferredLanguage` (en/ar)
- `doctorProfile`: specialization, `yearsExperience`, `medicalLicenseNumber`, licenseImage, price, about
- `isVerified` (doctors require verification), `lastLoginAt`
- `passwordResetToken`, `passwordResetExpires` (select: false)
- `isDeleted` (soft-delete, select: false)
- Virtuals: `isDoctor`, `isPatient`
- Password hashing with bcrypt (salt rounds: 12)

### Patient (sub-document)
- `userId` (1:1 with User, unique index)
- Health profile: `bloodType`, `height`, `weight`, `conditions`, `allergies`
- `emergencyContact`: name, phone, relationship
- `emergencyQR`: token, hashed PIN, expiry, `usedAt`, `accessLog` (IP + timestamp)
- `radiologyTests` & `labTests`: image + description + date + archived flag arrays

### Medication
- `patientId`, `medicineName`, `dosage` (value + unit)
- `frequency` & auto-calculated `intakeTimes`
- `startDate`, `endDate`, `indication`, `notes`
- `isActive` (soft-delete)

### DoseLog
- `patientId`, `medicationId`, `date` (YYYY-MM-DD), `time`
- `status`: `pending` | `taken` | `skipped` | `missed`

### Appointment
- `patient`, `doctor`, `status` (`pending` → `accepted`/`rejected` → `completed`/`cancelled`), `scheduledAt`, `notes`

### Post
- `author`, `type`: `article` | `community`
- `title`, `content`, `image`, `category`, `tags`
- `status`: `draft` | `published` | `archived`
- `views`, `isDeleted` (soft-delete, select: false)

### Conversation & Message
- Conversation tied to `appointmentId` (unique)
- Messages: `sender`, `conversation`, `text`, `image`, `read`, `readAt`
- Real-time delivery via Socket.io (JWT-authenticated)

### BotConversation
- `userId` (ref User), `title`, `lastMessage`, `lastMessageAt`
- Indexed by `userId + lastMessageAt` for sorted queries

### BotMessage
- `conversation` (ref BotConversation), `role` (`user` | `assistant`), `content`
- Indexed by `conversation + createdAt` for chronological retrieval

---

## Security

- **Helmet** — Security headers (CSP disabled for uploads, HSTS enabled, frameguard deny, referrer-policy strict-origin-when-cross-origin)
- **CORS** — Origin whitelist with credentials, preflight cache 1hr
- **Rate Limiting** — Login (5/15min), auth signup/refresh/reset (10/15min), QR access (5/15min)
- **HPP** — HTTP Parameter Pollution protection
- **Input Sanitization** — MongoDB `$` operator injection stripping from request bodies
- **Body Size Limit** — JSON/URL-encoded payloads limited to 100KB
- **Compression** — Gzip compression for responses (threshold 1KB)
- **File Upload Security** —
  - Allowed types: JPEG, PNG, GIF, WebP, PDF
  - Max size: 10MB per file, max 10 files
  - Temp-to-final routing with cleanup on failure
  - Path traversal prevention
- **JWT** — Short-lived access tokens (15min) + long-lived refresh tokens (7d) in httpOnly cookies
- **Socket.io Auth** — JWT validation required for WebSocket connections
- **Password Reset** — 6-digit code, SHA-256 hashed, 10-minute expiry
- **Emergency QR** — SHA-256 hashed PIN, 24-hour expiry, access logging with IP

---

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run with coverage from specific source folders
npm run test:file

# Watch mode
npm run test:watch

# CI mode (with verbose output)
npm run test:ci
```

**Test Stack:**
- Jest 29 with `--experimental-vm-modules` for ESM
- Supertest for HTTP assertions
- MongoDB Memory Server for isolated DB per test
- HTML test report generation via `jest-html-reporters`

---

## Deployment

Deployed on **Koyeb** at:
```
https://tender-morna-axon-fp-b76b6646.koyeb.app/
```

### Steps

1. Push code to GitHub
2. Connect repo on [Koyeb](https://www.koyeb.com/)
3. Set environment variables in Koyeb dashboard
4. Add `NODE_ENV=production` and `APP_URL=https://tender-morna-axon-fp-b76b6646.koyeb.app/`
5. Deploy — Koyeb handles Node.js automatically

### Health Check

```bash
curl https://tender-morna-axon-fp-b76b6646.koyeb.app/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-06-20T04:00:00.000Z",
  "uptime": 3600,
  "services": {
    "database": "connected"
  }
}
```

Returns `503` with `"status": "degraded"` if database is disconnected.

---

## License

ISC — AXON Team

---

> Built with care for better healthcare accessibility.

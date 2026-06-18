# AXON Medical API

A comprehensive backend API for a medical platform connecting patients and doctors. Built with Node.js, Express, and MongoDB Atlas for a graduation project.

**Team:** Khaled, Abd-Elrahman

**Live API:** [https://tender-morna-axon-fp-b76b6646.koyeb.app](https://tender-morna-axon-fp-b76b6646.koyeb.app)

**Repository:** [https://github.com/axonteamdev-stack/AXON](https://github.com/axonteamdev-stack/AXON)

## Features

- **Authentication** — JWT-based auth with dual token system (access + refresh cookies), role support (patient, doctor, admin), email verification, password reset
- **User Profiles** — Patients with medical history, emergency QR, blood type; Doctors with specialization, license, pricing
- **Medication Tracking** — Schedule medications, track doses, mark taken/skipped/missed, get pending reminders. Doctors prescribe, patients can self-prescribe
- **Appointments** — Book, accept, reject, complete, cancel appointments between patients and doctors
- **Real-time Chat** — Socket.io powered messaging tied to appointments
- **Posts & Community** — Doctors write articles (no comments), patients write community posts (comments + likes allowed)
- **Medical Records** — Radiology and lab test images with descriptions, archiving support
- **Emergency QR** — Scannable QR code with 24h expiry, PIN-protected, offline vitals encoded in URL
- **Drug Interaction (DDI)** — AI-powered drug interaction checker
- **Notifications** — Push notifications for appointments, medications, chat, system alerts
- **i18n** — Arabic (default) and English support with RTL, bilingual error messages
- **File Uploads** — Multer-based flat temp → final folder routing (personalPhoto, certificates, radiology, labTests, posts, articles)

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Runtime | Node.js | 20+ |
| Framework | Express.js | ^5.2.1 |
| Database | MongoDB Atlas | — |
| ODM | Mongoose | ^9.6.2 |
| Auth | JWT (jsonwebtoken) + bcryptjs | ^9.0.2 / ^3.0.3 |
| Validation | Zod | ^4.3.6 |
| Real-time | Socket.io | ^4.8.3 |
| Email | Nodemailer | ^7.0.12 |
| Logging | Pino + pino-pretty | ^10.3.1 / ^13.1.3 |
| Uploads | Multer | ^1.4.5-lts.1 |
| Security | Helmet, CORS, cookie-parser, express-rate-limit, hpp | — |
| QR Codes | qrcode | ^1.5.4 |
| Testing | Jest + Supertest | ^29.7.0 / ^7.2.2 |

## Database Schema

<details>
<summary>📊 ER Diagram — Mermaid (click to expand)</summary>

```mermaid
erDiagram
    USER ||--o{ PATIENT : "has profile"
    USER ||--o{ MEDICATION : "prescribed"
    USER ||--o{ APPOINTMENT : "books as patient"
    USER ||--o{ APPOINTMENT : "accepts as doctor"
    USER ||--o{ POST : "authors"
    USER ||--o{ COMMENT : "writes"
    USER ||--o{ LIKE : "gives"
    USER ||--o{ NOTIFICATION : "receives"
    USER ||--o{ CONVERSATION : "participates"
    USER ||--o{ MESSAGE : "sends"
    USER ||--o{ DOSE_LOG : "tracks"

    PATIENT ||--o{ MEDICATION : "has"
    PATIENT ||--o{ DOSE_LOG : "logs"

    MEDICATION ||--o{ DOSE_LOG : "generates"

    APPOINTMENT ||--|| CONVERSATION : "spawns"

    CONVERSATION ||--o{ MESSAGE : "contains"

    POST ||--o{ COMMENT : "has"
    POST ||--o{ LIKE : "receives"

    USER {
        ObjectId _id PK
        String fullName
        String email UK
        String phoneNumber
        String gender
        String password
        String personalPhoto
        String preferredLanguage
        String role
        Boolean isVerified
        Date lastLoginAt
        Object doctorProfile
        String passwordResetToken
        Date passwordResetExpires
        Boolean isDeleted
        Date createdAt
        Date updatedAt
    }

    PATIENT {
        ObjectId _id PK
        ObjectId userId FK "UK"
        String bloodType
        Number height
        Number weight
        String[] conditions
        String[] allergies
        Object emergencyContact
        Object emergencyQR
        Object[] radiologyTests
        Object[] labTests
        Date createdAt
        Date updatedAt
    }

    MEDICATION {
        ObjectId _id PK
        ObjectId patientId FK
        String medicineName
        Object dosage
        String frequency
        String[] intakeTimes
        Date startDate
        Date endDate
        String indication
        String notes
        Boolean isActive
        Date createdAt
        Date updatedAt
    }

    DOSE_LOG {
        ObjectId _id PK
        ObjectId patientId FK
        ObjectId medicationId FK
        String date
        String time
        String status
        Date updatedAt
        Date createdAt
    }

    APPOINTMENT {
        ObjectId _id PK
        ObjectId patient FK
        ObjectId doctor FK
        String status
        Date scheduledAt
        String notes
        Date createdAt
        Date updatedAt
    }

    CONVERSATION {
        ObjectId _id PK
        ObjectId[] participants FK
        ObjectId appointmentId FK "UK"
        String lastMessage
        Date lastMessageAt
        Date createdAt
        Date updatedAt
    }

    MESSAGE {
        ObjectId _id PK
        ObjectId sender FK
        ObjectId conversation FK
        String text
        String image
        Boolean read
        Date readAt
        Date createdAt
        Date updatedAt
    }

    POST {
        ObjectId _id PK
        ObjectId author FK
        String type
        String title
        String content
        String image
        String category
        String[] tags
        String status
        Number views
        Boolean isDeleted
        Date createdAt
        Date updatedAt
    }

    COMMENT {
        ObjectId _id PK
        ObjectId post FK
        ObjectId author FK
        String content
        Boolean isDeleted
        Date createdAt
        Date updatedAt
    }

    LIKE {
        ObjectId _id PK
        ObjectId user FK
        ObjectId post FK
        Date createdAt
        Date updatedAt
    }

    NOTIFICATION {
        ObjectId _id PK
        ObjectId user FK
        String type
        String title
        String message
        Boolean read
        Mixed data
        Date createdAt
        Date updatedAt
    }
```

</details>

<details>
<summary>📐 ER Diagram — dbdiagram.io DSL (click to expand)</summary>

```dbml
Table User {
  _id objectId [pk]
  fullName string [not null]
  email string [unique, not null]
  phoneNumber string [not null]
  gender string [not null]
  password string [not null, note: 'hashed, select: false']
  personalPhoto string
  preferredLanguage string [default: 'ar']
  role string [default: 'patient']
  isVerified boolean [default: false]
  lastLoginAt datetime
  doctorProfile object [note: 'specialization, yearsExperience, medicalLicenseNumber, licenseImage, about, price']
  passwordResetToken string [note: 'select: false']
  passwordResetExpires datetime [note: 'select: false']
  isDeleted boolean [default: false, note: 'select: false']
  createdAt datetime
  updatedAt datetime
}

Table Patient {
  _id objectId [pk]
  userId objectId [unique, not null]
  bloodType string
  height number
  weight number
  conditions string[]
  allergies string[]
  emergencyContact object [note: 'name, phone, relationship']
  emergencyQR object [note: 'token, pin, expiresAt, usedAt, accessLog[]']
  radiologyTests object[] [note: 'image, description, date, archived']
  labTests object[] [note: 'image, description, date, archived']
  createdAt datetime
  updatedAt datetime
}

Table Medication {
  _id objectId [pk]
  patientId objectId [not null]
  medicineName string [not null]
  dosageValue number [not null]
  dosageUnit string [not null]
  frequency string [not null]
  intakeTimes string[] [not null]
  startDate datetime [not null]
  endDate datetime [not null]
  indication string
  notes string
  isActive boolean [default: true]
  createdAt datetime
  updatedAt datetime
}

Table DoseLog {
  _id objectId [pk]
  patientId objectId [not null]
  medicationId objectId [not null]
  date string [not null, note: 'YYYY-MM-DD']
  time string [not null, note: 'HH:MM']
  status string [default: 'pending']
  updatedAt datetime
  createdAt datetime
}

Table Appointment {
  _id objectId [pk]
  patientId objectId [not null]
  doctorId objectId [not null]
  status string [default: 'pending']
  scheduledAt datetime [not null]
  notes string
  createdAt datetime
  updatedAt datetime
}

Table Conversation {
  _id objectId [pk]
  participants objectId[]
  appointmentId objectId [unique]
  lastMessage string
  lastMessageAt datetime
  createdAt datetime
  updatedAt datetime
}

Table Message {
  _id objectId [pk]
  senderId objectId [not null]
  conversationId objectId [not null]
  text string
  image string
  read boolean [default: false]
  readAt datetime
  createdAt datetime
  updatedAt datetime
}

Table Post {
  _id objectId [pk]
  authorId objectId [not null]
  type string [not null, note: 'article | community']
  title string [not null]
  content string [not null]
  image string
  category string
  tags string[]
  status string [default: 'published']
  views number [default: 0]
  isDeleted boolean [default: false]
  createdAt datetime
  updatedAt datetime
}

Table Comment {
  _id objectId [pk]
  postId objectId [not null]
  authorId objectId [not null]
  content string [not null]
  isDeleted boolean [default: false]
  createdAt datetime
  updatedAt datetime
}

Table Like {
  _id objectId [pk]
  userId objectId [not null]
  postId objectId [not null]
  createdAt datetime
  updatedAt datetime
}

Table Notification {
  _id objectId [pk]
  userId objectId [not null]
  type string [not null]
  title string [not null]
  message string [not null]
  read boolean [default: false]
  data mixed
  createdAt datetime
  updatedAt datetime
}

Ref: Patient.userId > User._id
Ref: Medication.patientId > User._id
Ref: DoseLog.patientId > User._id
Ref: DoseLog.medicationId > Medication._id
Ref: Appointment.patientId > User._id
Ref: Appointment.doctorId > User._id
Ref: Conversation.appointmentId > Appointment._id
Ref: Message.senderId > User._id
Ref: Message.conversationId > Conversation._id
Ref: Post.authorId > User._id
Ref: Comment.postId > Post._id
Ref: Comment.authorId > User._id
Ref: Like.userId > User._id
Ref: Like.postId > Post._id
Ref: Notification.userId > User._id
```

**View online:** [dbdiagram.io](https://dbdiagram.io/d) → paste the DSL above

</details>

## API Endpoints

Base URL: `https://tender-morna-axon-fp-b76b6646.koyeb.app/api/v1`

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup/patient` | — | Register as patient (with optional photo, radiology, lab images) |
| POST | `/auth/signup/doctor` | — | Register as doctor (with license + photo) |
| POST | `/auth/login` | — | Login, sets access + refresh cookies |
| POST | `/auth/logout` | — | Clear auth cookies |
| POST | `/auth/refresh` | — | Rotate access + refresh tokens |
| POST | `/auth/forgot-password` | — | Request 6-digit reset code via email |
| POST | `/auth/reset-password` | — | Reset password with code |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users/doctors` | — | List all verified doctors (paginated) |
| GET | `/users/doctors/search` | — | Search doctors by keyword/specialization |
| GET | `/users/doctors/:id` | — | Get doctor public profile |
| GET | `/users/patients/:id` | — | Get patient public profile |
| GET | `/users/me` | ✅ | Get current user full profile (with stats) |
| PATCH | `/users/me` | ✅ | Update profile (with `personalPhoto` upload) |

### Medical Records
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/records/me` | ✅ | Get my medical record |
| PATCH | `/records/me` | ✅ | Update medical record |
| POST | `/records/tests/:type` | ✅ | Upload radiology/lab test image |
| POST | `/records/qr` | ✅ | Generate emergency QR code |
| GET | `/records/emergency/:token` | — | Public emergency page (HTML) |
| GET | `/records/emergency-data/:token` | — | Public emergency JSON data |
| GET | `/records/qr/access/:patientId` | ✅ | Doctor access via patient ID |

### Medications
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/medications` | ✅ | Doctor | Prescribe medication to patient |
| POST | `/medications/self` | ✅ | Patient | Self-prescribe medication |
| GET | `/medications` | ✅ | Any | List my medications |
| GET | `/medications/pending-doses` | ✅ | Any | Get next pending dose for today |
| GET | `/medications/patient/:patientId` | ✅ | Doctor | List patient's medications |
| GET | `/medications/:id` | ✅ | Any | Get medication details |
| PATCH | `/medications/:id` | ✅ | Any | Update medication |
| DELETE | `/medications/:id` | ✅ | Any | Soft delete medication |
| POST | `/medications/:id/doses` | ✅ | Any | Mark dose taken/skipped |

### Appointments
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/appointments` | ✅ | Patient | Book appointment with doctor |
| GET | `/appointments/my` | ✅ | Any | List my appointments |
| GET | `/appointments/pending` | ✅ | Doctor | List pending requests |
| GET | `/appointments/history` | ✅ | Doctor | List completed/cancelled history |
| PATCH | `/appointments/:id/status` | ✅ | Doctor | Accept or reject appointment |
| PATCH | `/appointments/:id/cancel` | ✅ | Any | Cancel appointment |

### Chat
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/chat/start/:appointmentId` | ✅ | Start conversation for appointment |
| GET | `/chat/conversations` | ✅ | List my conversations |
| GET | `/chat/:conversationId/messages` | ✅ | Get messages (marks as read) |
| POST | `/chat/:conversationId/messages` | ✅ | Send message (emits via Socket.io) |

### Posts
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/posts/articles` | — | — | List all articles |
| GET | `/posts/community` | — | — | List all community posts |
| GET | `/posts/doctor/:doctorId` | — | — | List doctor's articles |
| GET | `/posts/:id` | — | — | Get post details (increments views) |
| GET | `/posts/:id/comments` | — | — | List comments on community post |
| POST | `/posts/articles` | ✅ | Doctor | Create article (with `articleImage`) |
| POST | `/posts/community` | ✅ | Patient | Create community post (with `postImage`) |
| PATCH | `/posts/:id` | ✅ | Author | Update post |
| DELETE | `/posts/:id` | ✅ | Author | Soft delete post |
| POST | `/posts/:id/like` | ✅ | Patient | Toggle like |
| POST | `/posts/:id/comments` | ✅ | Patient | Add comment |

### Prescriptions (Doctor-only)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/prescriptions/appointment/:appointmentId` | ✅ | Prescribe from appointment |
| POST | `/prescriptions/qr` | ✅ | Prescribe via emergency QR scan |

### DDI (Drug Interaction)
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/ddi/check` | ✅ | Doctor | Check new drug against patient's active meds |
| POST | `/ddi/contraindications` | ✅ | Doctor | Check contraindications against patient record |

### Notifications
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/notifications` | ✅ | List my notifications |
| GET | `/notifications/unread-count` | ✅ | Get unread count |
| PATCH | `/notifications/read-all` | ✅ | Mark all as read |
| PATCH | `/notifications/:id/read` | ✅ | Mark single as read |

## Environment Variables

Create a `.env` file:

```env
# Server
NODE_ENV=development
PORT=8000

# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/axon

# JWT (min 32 chars each)
JWT_SECRET=your-super-secret-key-min-32-chars
REFRESH_SECRET=your-refresh-secret-key-min-32-chars
JWT_EXPIRES_IN=15m
REFRESH_EXPIRES_IN=7d

# App
APP_URL=https://tender-morna-axon-fp-b76b6646.koyeb.app
ALLOWED_ORIGINS=https://your-frontend.com,http://localhost:3000

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Logging
LOG_LEVEL=info
LOG_RETENTION_DAYS=30
LOG_MAX_SIZE_MB=100
LOG_ROTATION_SIZE_MB=50
LOG_ROTATION_COUNT=5

# DDI AI Service
AI_DDI_SERVICE_URL=http://localhost:5001/api/predict-ddi
```

## Setup & Run

```bash
# 1. Clone
git clone https://github.com/axonteamdev-stack/AXON.git
cd AXON/backend

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your values

# 4. Run development server
npm run dev

# 5. Run tests
npm test

# 6. Run production
npm start
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Production server |
| `npm run dev` | Development with nodemon |
| `npm test` | Run Jest test suite (ESM) |
| `npm run test:coverage` | Run with coverage report |
| `npm run test:file` | Coverage for services/controllers/middlewares/utils/models |
| `npm run test:watch` | Watch mode |
| `npm run test:ci` | CI mode with verbose coverage |

## Deployment

Deployed on **Koyeb**:

```bash
# Push to GitHub, Koyeb auto-deploys from main branch
# Or use Koyeb CLI:
koyeb app init axon-backend --git github.com/axonteamdev-stack/AXON
```

## Project Structure

```
AXON/
├── server.js                 # Entry point — env validation, DB connect, server start
├── app.js                    # Express app — middleware, routes, error handling
├── package.json
├── .env
├── uploads/                  # Static file storage
│   ├── certificates/         # Doctor license images
│   ├── personalPhoto/        # User profile photos
│   ├── radiology/            # Radiology test images
│   ├── labTests/             # Lab test images
│   ├── posts/                # Community post images
│   ├── articles/             # Article images
│   └── .temp/                # Flat temp upload staging
├── src/
│   ├── config/
│   │   ├── db.js             # MongoDB connection with retry logic
│   │   ├── env.js            # Environment variable validation
│   │   ├── logger.js         # Pino multi-stream logging with rotation
│   │   └── socket.js         # Socket.io initialization
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── medicationController.js
│   │   ├── appointmentController.js
│   │   ├── chatController.js
│   │   ├── postController.js
│   │   ├── recordController.js
│   │   ├── ddiController.js
│   │   ├── notificationController.js
│   │   └── prescriptionController.js
│   ├── middlewares/
│   │   ├── auth.js           # JWT protect + role restrict
│   │   ├── socketAuth.js     # Socket.io JWT auth
│   │   ├── validate.js       # Zod body validation
│   │   ├── ValidateObjectId.js
│   │   ├── parseUniversal.js # Multipart/JSON/URL-encoded parser
│   │   ├── upload.js         # Multer config + file routing
│   │   ├── i18n.js           # Language setter
│   │   └── errorHandler.js   # Global error handler
│   ├── models/
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
│   │   └── Notification.js
│   ├── routes/
│   │   ├── index.js          # Route aggregator
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── medicationRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── postRoutes.js
│   │   ├── recordRoutes.js
│   │   ├── ddiRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── prescriptionRoutes.js
│   ├── services/
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
│   │   └── fileService.js
│   ├── utils/
│   │   ├── AppError.js       # Custom error class with i18n
│   │   ├── catchAsync.js     # Async error wrapper
│   │   ├── i18n.js           # Localization helpers
│   │   ├── response.js       # Standardized API responses
│   │   └── transformers.js   # User response formatter
│   └── validators/
│       ├── authValidator.js
│       └── medicationValidator.js
└── tests/                    # Jest test suite
```

## Architecture Highlights

### Auth Flow
- **Dual tokens:** Short-lived access token (15m) + long-lived refresh token (7d) in httpOnly cookies
- **Rotation:** Refresh endpoint clears old cookies and issues fresh pair
- **Socket.io:** JWT verified via `socket.handshake.auth.token`

### Upload System
- **Flat temp:** All files land in `uploads/.temp/` first
- **Field routing:** `personalPhoto` → `personalPhoto/`, `licenseImage` → `certificates/`, etc.
- **Rollback:** On controller error, moved files are deleted and temp files cleaned up
- **Allowed types:** JPEG, PNG, GIF, WebP, PDF (max 10MB, 10 files)

### i18n
- **Bilingual messages:** `msg(ar, en)` returns `{ar, en}` object
- **Resolution order:** `req.user.preferredLanguage` → `req.lang` → `Accept-Language` header → `?lang=` query → default `ar`
- **Zod integration:** Validation errors return localized messages

### Logging
- **Pino multi-stream:** stdout (info+) + `logs/app.log` (info+) + `logs/error.log` (error+)
- **Rotation:** Automatic when file exceeds 50MB, keeps 5 backups
- **Cleanup:** Deletes logs older than 30 days or larger than 100MB
- **Pretty print:** Enabled in development only

### Security
- **Helmet:** CSP disabled, HSTS enabled, frame deny, strict referrer
- **HPP:** HTTP Parameter Pollution protection
- **NoSQL injection:** `$` prefix stripped from all request bodies
- **Rate limiting:** 5 req/15min on login, 10 req/15min on auth routes, 5 req/15min on QR access
- **CORS:** Origin whitelist with credentials

## Health Check

```bash
curl https://tender-morna-axon-fp-b76b6646.koyeb.app/health
```

Returns:
```json
{
  "status": "ok",
  "timestamp": "2026-06-19T00:00:00.000Z",
  "uptime": 12345.67,
  "services": { "database": "connected" }
}
```

## License

Graduation Project — 2026

**Built by:** Khaled & Abd-Elrahman

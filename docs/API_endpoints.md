# AXON API Reference

Base URL: `/api/v1`

Production: `https://tender-morna-axon-fp-b76b6646.koyeb.app/api/v1`

---

## Authentication

Rate limits: Login (5/15min), Signup/Refresh/Reset (10/15min)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup/patient` | — | Register a new patient (supports multipart file upload) |
| POST | `/auth/signup/doctor` | — | Register a new doctor (requires license image) |
| POST | `/auth/login` | — | Login with email/password |
| POST | `/auth/logout` | — | Clear auth cookies |
| POST | `/auth/refresh` | — | Rotate access/refresh tokens |
| POST | `/auth/forgot-password` | — | Request password reset code (emailed) |
| POST | `/auth/reset-password` | — | Reset password with code |

### Signup Patient

```
POST /auth/signup/patient
Content-Type: application/json (or multipart/form-data)

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "01001234567",
  "gender": "Male",
  "password": "secure123",
  "preferredLanguage": "en",
  "bloodType": "O+",
  "height": 175,
  "weight": 70,
  "conditions": ["diabetes"],
  "allergies": ["penicillin"]
}
```

### Signup Doctor

```
POST /auth/signup/doctor
Content-Type: multipart/form-data

Fields: fullName, email, phoneNumber, gender, password,
        specialization, medicalLicenseNumber, yearsExperience,
        price, about, licenseImage (file), personalPhoto (file)
```

### Login

```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": "...", "fullName": "...", "email": "...", "role": "patient" },
    "tokens": {
      "accessToken": "eyJ...",
      "refreshToken": "eyJ..."
    }
  }
}
```

### Token Refresh

```
POST /auth/refresh
Cookie: refreshToken=eyJ...
```

---

## Users

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/users/doctors` | — | — | List verified doctors (paginated) |
| GET | `/users/doctors/search` | — | — | Search doctors by name/specialization |
| GET | `/users/doctors/:id` | — | — | Get doctor public profile |
| GET | `/users/patients/:id` | — | — | Get patient public profile |
| GET | `/users/me` | ✓ | — | Get authenticated user profile |
| PATCH | `/users/me` | ✓ | — | Update profile (supports photo upload) |

---

## Medications

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
| POST | `/medications/:id/doses` | ✓ | patient | Log dose (taken/skipped) |

### Create Medication

```
POST /medications
Content-Type: application/json

{
  "patientId": "...",
  "medicineName": "Aspirin",
  "dosage": { "value": 500, "unit": "mg" },
  "frequency": "twice-daily",
  "intakeTimes": ["08:00", "20:00"],
  "startDate": "2026-06-20",
  "endDate": "2026-07-20",
  "indication": "Headache",
  "notes": "Take with food"
}
```

### Log Dose

```
POST /medications/:id/doses
Content-Type: application/json

{
  "status": "taken"  // "taken" | "skipped" | "missed"
}
```

---

## Appointments

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/appointments` | ✓ | patient | Book an appointment |
| GET | `/appointments/my` | ✓ | patient | Get my appointments |
| GET | `/appointments/pending` | ✓ | doctor | Get pending requests |
| GET | `/appointments/history` | ✓ | doctor | Get appointment history |
| PATCH | `/appointments/:id/status` | ✓ | doctor | Accept/reject (auto-creates chat on accept) |
| PATCH | `/appointments/:id/cancel` | ✓ | patient | Cancel appointment |

### Book Appointment

```
POST /appointments
Content-Type: application/json

{
  "doctorId": "...",
  "scheduledAt": "2026-06-25T10:00:00Z",
  "notes": "I have a persistent cough"
}
```

### Accept/Reject Appointment

```
PATCH /appointments/:id/status
Content-Type: application/json

{
  "status": "accepted"  // "accepted" | "rejected"
}
```

Status flow: `pending` → `accepted` | `rejected` → `completed` | `cancelled`

---

## Chat

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/chat/start/:appointmentId` | ✓ | Start conversation for an appointment |
| GET | `/chat/conversations` | ✓ | Get my conversations |
| GET | `/chat/:conversationId/messages` | ✓ | Get messages (marks as read) |
| POST | `/chat/:conversationId/messages` | ✓ | Send a message (text or image) |

### Send Message

```
POST /chat/:conversationId/messages
Content-Type: application/json

{
  "text": "Hello doctor, I have a question"
}
```

### WebSocket Events

```
Connection: socket.io with JWT auth token

Events:
  - joinConversation(conversationId)    → Join a conversation room
  - newMessage                          ← Receive real-time messages
  - appointmentUpdated                   ← Receive status updates
  - newAppointment                      ← Doctors receive new booking alerts
```

---

## Posts & Community

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/posts/articles` | — | — | List doctor articles |
| GET | `/posts/community` | — | — | List community posts |
| GET | `/posts/doctor/:doctorId` | — | — | Get doctor's articles |
| GET | `/posts/:id` | — | — | Get single post (increments view count) |
| GET | `/posts/:id/comments` | — | — | Get post comments |
| POST | `/posts/articles` | ✓ | doctor | Publish article (with optional image) |
| POST | `/posts/community` | ✓ | patient | Create community post |
| PATCH | `/posts/:id` | ✓ | — | Update own post |
| DELETE | `/posts/:id` | ✓ | — | Soft-delete own post |
| POST | `/posts/:id/like` | ✓ | patient | Toggle like |
| POST | `/posts/:id/comments` | ✓ | patient | Add comment |

---

## Medical Records

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/records/me` | ✓ | Get my medical record |
| PATCH | `/records/me` | ✓ | Update medical record |
| POST | `/records/tests/:type` | ✓ | Add radiology or lab test (with image) |
| POST | `/records/qr` | ✓ | Generate emergency QR code |
| GET | `/records/emergency/:token` | — | View emergency page (rate-limited: 5/15min) |
| GET | `/records/emergency-data/:token` | — | Get emergency data JSON (rate-limited) |
| GET | `/records/qr/access/:patientId` | — | Access by patient ID (rate-limited) |
| GET | `/records/qr-test` | — | Open QR studio viewer |

### Generate Emergency QR

```
POST /records/qr
Content-Type: application/json

{
  "pin": "1234"  // 4-6 digit PIN
}
```

Response: Returns QR code image data + access token.

---

## DDI (Drug-Drug Interaction)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/ddi/check` | ✓ | patient | Check new drug against own existing medications |
| POST | `/ddi/contraindications` | ✓ | patient | Check contraindications for self |
| POST | `/ddi/check/appointments/:appointmentId` | ✓ | doctor | Check new drug against patient's medications |
| POST | `/ddi/contraindications/appointments/:appointmentId` | ✓ | doctor | Check contraindications for patient |
| POST | `/ddi/check-direct` | ✓ | — | Direct drug-to-drug interaction check |

### Direct Drug Check

```
POST /ddi/check-direct
Content-Type: application/json

{
  "drugs": ["ibuprofen", "aspirin", "warfarin"]
}
```

Response:
```json
{
  "risk_level": "high",
  "conflicts": [
    { "drug_a": "ibuprofen", "drug_b": "warfarin", "risk_level": "high", "confidence": 0.89 },
    { "drug_a": "aspirin", "drug_b": "warfarin", "risk_level": "medium", "confidence": 0.45 }
  ],
  "recommendation": "Some drug combinations require monitoring"
}
```

---

## Notifications

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/notifications` | ✓ | Get my notifications (paginated) |
| GET | `/notifications/unread-count` | ✓ | Get unread notification count |
| PATCH | `/notifications/read-all` | ✓ | Mark all notifications as read |
| PATCH | `/notifications/:id/read` | ✓ | Mark single notification as read |

---

## Prescriptions

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/prescriptions/appointment/:appointmentId` | ✓ | doctor | Prescribe from appointment |
| POST | `/prescriptions/qr` | ✓ | doctor | Prescribe via emergency QR + PIN |

---

## AI ChatBot

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/chatbot/ask` | ✓ | Ask a general medical question |
| POST | `/chatbot/personalized` | ✓ | Ask with patient context (conditions, medications, allergies) |
| GET | `/chatbot/conversations` | ✓ | List chatbot conversation history |
| GET | `/chatbot/:conversationId/messages` | ✓ | Get messages in a conversation |

### General Question

```
POST /chatbot/ask
Content-Type: application/json

{
  "prompt": "What are the side effects of metformin?"
}
```

### Personalized Question

```
POST /chatbot/personalized
Content-Type: application/json

{
  "prompt": "Is it safe to take ibuprofen with my current medications?"
}
```

The personalized endpoint automatically includes the patient's blood type, conditions, allergies, and active medications as context for the AI.

---

## System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check (DB status, uptime) |
| GET | `/` | Welcome message |

### Health Check

```
GET /health
```

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

Returns 200 if healthy, 503 if degraded.

---

## Authentication

All protected endpoints require either:

**Header:**
```
Authorization: Bearer <accessToken>
```

**Cookie:**
```
Cookie: accessToken=<jwt>
```

## Error Responses

```json
// 400 Bad Request
{ "status": "fail", "message": "Validation error description" }

// 401 Unauthorized
{ "status": "fail", "message": "You are not logged in" }

// 403 Forbidden
{ "status": "fail", "message": "You do not have permission" }

// 404 Not Found
{ "status": "fail", "message": "Route not found" }

// 429 Too Many Requests
{ "status": "fail", "message": "Too many requests. Please try again later." }

// 500 Internal Server Error (production: generic)
{ "status": "error", "message": "Something went wrong" }
```

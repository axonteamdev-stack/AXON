# AXON — Healthcare Management Platform

> A comprehensive healthcare platform connecting patients and doctors with AI-powered drug interaction checking, real-time communication, medication tracking, and emergency medical QR codes.

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│         React 19 + Vite 8 (Web)                 │
│         Flutter (Mobile)                        │
└────────────────────┬────────────────────────────┘
                     │ HTTP / WebSocket
┌────────────────────▼────────────────────────────┐
│              Backend API                         │
│        Node.js + Express 5 + Socket.io           │
│        MongoDB (Mongoose ODM)                    │
│        JWT Auth · Zod Validation · Helmet        │
└────────────────────┬────────────────────────────┘
                     │ HTTP
┌────────────────────▼────────────────────────────┐
│           AI DDI Service                        │
│        FastAPI + PyTorch + HDN-DDI Model         │
│        Drug-Drug Interaction Prediction           │
└─────────────────────────────────────────────────┘
```

## Components

| Component | Stack | Description |
|-----------|-------|-------------|
| **Backend API** | Node.js 20+, Express 5, MongoDB | RESTful API + WebSocket for auth, users, medications, appointments, chat, posts, records, DDI, notifications, prescriptions, AI chatbot |
| **Web Frontend** | React 19, Vite 8, Tailwind 4 | Patient and doctor interfaces with bilingual support (AR/EN) |
| **Mobile App** | Flutter | Cross-platform mobile application for iOS, Android, Web, Desktop |
| **AI DDI Service** | FastAPI, PyTorch, RDKit | Drug-drug interaction prediction using HDN-DDI hierarchical graph neural network |
| **Emergency QR** | QR Code + PIN | Scannable emergency medical profiles for first responders |

## Key Features

- **Dual-role system** — Patients and Doctors with role-based access
- **Medication tracking** — Prescribe, self-prescribe, dose logging with auto-generated intake schedules
- **Appointment booking** — Book, accept/reject, cancel with real-time chat via Socket.io
- **AI drug interaction checks** — Predict interaction risk (high/medium/low) between drug pairs
- **AI medical chatbot** — Bilingual assistant (OpenRouter + Gemini fallback) with patient context awareness
- **Emergency QR codes** — PIN-protected emergency medical profiles with access logging
- **Community** — Doctor articles and patient community posts with comments and likes
- **Real-time notifications** — In-app notification system with unread counts
- **i18n** — Full Arabic/English bilingual support with RTL

## Project Structure

```
AXON/
├── backend/           # Node.js + Express API server
│   ├── src/           # Source code (controllers, services, models, routes, middlewares)
│   ├── tests/         # Jest test suite (14 test files)
│   └── postman/       # Postman collection
├── frontend/          # React + Vite web application
│   └── src/           # React components, pages, hooks, i18n
├── flutter/           # Flutter cross-platform mobile app
│   ├── lib/           # Dart source code
│   ├── android/       # Android-specific code
│   └── ios/           # iOS-specific code
├── ai/                # Python AI service for DDI prediction
│   ├── src/api/       # FastAPI endpoints
│   ├── src/model/     # HDN-DDI inference engine
│   └── data/          # Drug datasets (DrugBank, Twosides)
├── docs/              # Documentation
├── scripts/           # Deployment scripts
└── .env.example       # Environment template
```

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- MongoDB Atlas (or local MongoDB)
- Python 3.11 (for AI service)
- Flutter SDK (for mobile)

### Quick Start

```bash
# Backend
cd backend
npm install
cp .env.example .env   # Edit with your values
npm run dev

# Frontend
cd frontend
npm install
npm run dev

# AI DDI Service
cd ai
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python src/api/main.py
```

## Documentation

| Document | Description |
|----------|-------------|
| [Backend README](backend/README.md) | API docs, models, security, deployment |
| [Frontend README](frontend/README.md) | Web app setup and architecture |
| [Mobile README](flutter/README.md) | Flutter app setup and build |
| [AI Service README](ai/README.md) | DDI prediction, model details, API |
| [Security Overview](docs/security_overview.md) | Security architecture and practices |
| [API Endpoints](docs/API_endpoints.md) | Complete API reference |
| [AI Design](docs/AI_design.md) | AI/ML system design |

## Security

- JWT dual-token auth with httpOnly cookies (access: 15min, refresh: 7d)
- Helmet security headers, CORS whitelist, HPP protection
- Zod input validation + MongoDB `$`-injection sanitizer
- Rate limiting (5/15min login, 10/15min auth)
- bcrypt password hashing (12 rounds)
- Graceful shutdown, structured logging (Pino), global error handling

## License

ISC — AXON Team

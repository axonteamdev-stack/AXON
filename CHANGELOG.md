# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] — 2026-06-20

### Added

#### Backend
- JWT authentication with access/refresh token rotation
- Patient and doctor signup with file upload support
- Medication prescribing, self-prescribing, and dose logging
- Appointment booking with accept/reject/cancel workflow
- Real-time chat via Socket.io tied to appointments
- Doctor articles and patient community posts with comments and likes
- Medical records with radiology/lab test uploads
- Emergency QR code generation with PIN protection
- DDI (Drug-Drug Interaction) checking via AI service proxy
- Notifications system with unread counts
- Prescription generation from appointments and emergency QR
- AI medical chatbot (OpenRouter + Gemini fallback)
- Bilingual support (Arabic/English) with automatic language detection
- Input validation via Zod schemas
- Rate limiting on auth endpoints
- Helmet security headers and CORS whitelist
- MongoDB NoSQL injection sanitization
- Structured logging with Pino (file rotation, retention policies)
- Global error handling with bilingual error messages
- Graceful shutdown on SIGTERM/SIGINT
- Health check endpoint with database status
- Postman collection for API testing
- 14 Jest test files with MongoDB Memory Server
- 50% test coverage threshold

#### Frontend
- React 19 with Vite 8 build tooling
- Tailwind CSS 4 styling
- React Router 7 routing
- i18next bilingual support
- Dashboard layouts for patients and doctors
- Framer Motion animations
- Medication tracking UI
- Appointment management
- Real-time chat interface
- Community posts and articles
- Medical records viewer
- DDI checker with risk indicators
- AI ChatBot interface
- Notifications panel

#### Mobile (Flutter)
- Cross-platform Flutter app (Android, iOS, Web, Desktop)
- Patient and doctor interfaces
- Localization support (Arabic/English)

#### AI Service
- FastAPI-based DDI prediction microservice
- HDN-DDI hierarchical graph neural network
- DrugBank (86 relation types) and Twosides (963 relation types) datasets
- 4-tier drug resolution pipeline (cache → name map → direct ID → PubChem)
- Single and batch prediction endpoints
- Drug search by ID prefix
- Graceful degradation model
- Risk classification: high/medium/low

#### Infra & Docs
- Root project README with architecture overview
- Backend security documentation
- API endpoint reference
- AI/ML system design documentation
- Contribution guidelines
- Security policy
- Code of conduct
- Deployment scripts

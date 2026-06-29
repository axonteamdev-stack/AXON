# AXON — Web Frontend

> React 19 + Vite 8 web application for the AXON healthcare platform. Provides patient and doctor interfaces with bilingual (Arabic/English) and RTL support.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React 19 |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS 4 |
| **Routing** | React Router 7 |
| **i18n** | i18next + react-i18next + browser-language-detector |
| **HTTP Client** | Axios |
| **Animation** | Framer Motion 12 |
| **Icons** | Lucide React |

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

The dev server starts on `http://localhost:5173` by default.

### Build for Production

```bash
npm run build    # Outputs to dist/
npm run preview  # Preview production build
```

### Lint

```bash
npm run lint     # ESLint with React hooks plugin
```

## Environment Variables

```env
VITE_API_URL=http://localhost:3000/api/v1
```

## Features

- **Authentication** — Login, signup (patient/doctor), password reset
- **Dashboard** — Role-based home screens for patients and doctors
- **Medications** — Prescribe, self-prescribe, track doses with intake schedules
- **Appointments** — Book, manage, real-time chat with doctors
- **Posts** — Doctor articles and patient community posts with likes/comments
- **Medical Records** — Health profile, radiology/lab test uploads, emergency QR
- **DDI Checker** — Drug interaction checking with visual risk indicators
- **AI ChatBot** — Bilingual medical AI assistant
- **Notifications** — In-app notification system
- **i18n** — Full Arabic/English support with RTL layout

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── layout/     # Sidebar, Header, DashboardLayout
│   │   └── dashboard/  # Dashboard-specific components
│   ├── pages/          # Route-level page components
│   ├── hooks/          # Custom React hooks
│   ├── i18n/           # Translation files (ar, en)
│   ├── services/       # API client and service functions
│   ├── App.jsx         # Root component with routes
│   └── main.jsx        # Entry point
├── public/             # Static assets
├── index.html          # HTML shell
└── vite.config.js      # Vite configuration
```

## Related

- [Backend API](../backend/README.md)
- [AI DDI Service](../ai/README.md)
- [Mobile App](../flutter/README.md)

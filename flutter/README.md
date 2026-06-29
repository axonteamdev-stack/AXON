# AXON — Mobile App

> Cross-platform mobile application built with Flutter for the AXON healthcare platform. Supports Android, iOS, Web, Linux, macOS, and Windows.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Flutter 3.x (Dart) |
| **State Management** | Provider / Riverpod |
| **Localization** | Flutter i18n / l10n |
| **HTTP Client** | `http` or `dio` |
| **Real-time** | Socket.IO client (Dart) |

## Getting Started

```bash
cd flutter
flutter pub get
flutter run
```

### Build for Platforms

```bash
# Android
flutter build apk
flutter build appbundle

# iOS
flutter build ios

# Web
flutter build web

# Desktop
flutter build linux
flutter build macos
flutter build windows
```

## Features

- **Patient Dashboard** — View medications, appointments, health records
- **Doctor Dashboard** — Manage appointments, prescribe medications
- **Medication Tracking** — Dose logging with reminders
- **Appointments** — Book, accept/reject, real-time chat
- **Emergency QR** — Generate and scan emergency medical QR codes
- **DDI Checker** — Drug interaction risk checking
- **AI ChatBot** — Bilingual medical assistant
- **Notifications** — Push and in-app notifications
- **i18n** — Arabic and English with RTL support

## Project Structure

```
flutter/
├── lib/                # Dart source code
│   ├── screens/        # Page/screen widgets
│   ├── widgets/        # Reusable UI components
│   ├── models/         # Data models
│   ├── services/       # API and business logic
│   ├── providers/      # State management
│   └── l10n/           # Localization files
├── assets/             # Images, fonts, etc.
├── android/            # Android-specific configuration
├── ios/                # iOS-specific configuration
├── web/                # Web-specific configuration
├── test/               # Unit and widget tests
└── pubspec.yaml        # Dependencies
```

## Related

- [Backend API](../backend/README.md)
- [Web Frontend](../frontend/README.md)
- [AI DDI Service](../ai/README.md)

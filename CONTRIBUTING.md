# Contributing to AXON

Thank you for considering contributing to AXON! This document outlines the guidelines for contributing.

## Code of Conduct

By participating, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. Open a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, browser, Node version)
   - Screenshots if applicable

### Suggesting Features

1. Open an issue with the "enhancement" label
2. Describe the feature and its use case
3. Explain how it benefits the platform

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the code style conventions
4. Write or update tests as needed
5. Run the test suite before submitting
6. Submit a PR with a clear description of changes

## Development Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### AI Service

```bash
cd ai
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python src/api/main.py
```

### Mobile App

```bash
cd flutter
flutter pub get
flutter run
```

## Code Style

- **JavaScript/Node:** ES Modules, async/await, consistent naming
- **React:** Functional components with hooks
- **Python:** PEP 8, type hints
- **Dart:** Flutter style guide

## Testing

### Backend

```bash
cd backend
npm test          # Run all tests
npm run test:coverage  # With coverage report
```

### Frontend

```bash
cd frontend
npm run lint      # ESLint
```

## Commit Messages

Follow conventional commits:

```
feat: add medication dose logging
fix: resolve appointment status update
docs: update API endpoint reference
refactor: extract auth middleware
test: add DDI check test cases
```

## Branch Naming

- `feature/` — New features
- `fix/` — Bug fixes
- `docs/` — Documentation
- `refactor/` — Code refactoring
- `test/` — Test additions or fixes

# AXON Medical API

Backend API for the AXON Medical Platform.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file and fill in your values
cp .env.example .env

# 3. Start development server
npm run dev
```

## Environment Variables

See `.env.example` for all required variables.

## Project Structure

```
backend/
├── src/
│   ├── config/         # Database, logger, swagger, socket, email
│   ├── controllers/    # Route handlers
│   ├── middlewares/    # Auth, validation, rate limiting, error handling
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic
│   ├── utils/          # Helpers (i18n, errors, pagination, etc.)
│   └── jobs/           # Cron jobs
├── uploads/            # File storage
├── app.js              # Express app setup
└── server.js           # Entry point
```

## API Versioning

Current API version: **v2**

Base URL: `/api/v2`

## Authentication

JWT-based authentication with refresh tokens. Access tokens expire in 15 minutes, refresh tokens in 7 days.

## Security

- Helmet.js for security headers
- CORS with origin validation
- Rate limiting on auth and API routes
- MongoDB injection protection via `express-mongo-sanitize`
- File upload size limits and type validation

## License

ISC

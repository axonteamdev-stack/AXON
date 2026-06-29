# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x | ✅ |

## Reporting a Vulnerability

If you discover a security vulnerability, please **do not** open a public issue. Instead, report it privately:

1. **Contact the team** at the project maintainer's email address
2. Provide a detailed description of the vulnerability
3. Include steps to reproduce if possible
4. Expect acknowledgment within 48 hours

We will investigate all legitimate reports and work to address them promptly.

## Security Practices

This project implements the following security measures:

### Authentication & Authorization

- JWT dual-token auth with short-lived access tokens (15 min)
- Refresh tokens in httpOnly, secure, sameSite cookies
- bcrypt password hashing (12 salt rounds)
- Role-based access control (patient, doctor, admin)

### Input Validation

- Zod schema validation on all inputs
- MongoDB NoSQL injection prevention (`$`-key stripping)
- Request body size limits (100 KB)
- File upload MIME type and size restrictions

### API Security

- Helmet security headers (HSTS, frameguard, referrer-policy)
- CORS origin whitelist
- Rate limiting on sensitive endpoints
- HTTP Parameter Pollution protection

### Data Protection

- Passwords stored with `select: false` (never returned in queries)
- Password reset tokens SHA-256 hashed in database
- Emergency QR codes PIN-protected with access logging
- Soft-delete pattern for sensitive records

### Error Handling

- No stack traces or internal details exposed in production
- Structured error logging (Pino) for auditing
- Graceful shutdown on SIGTERM/SIGINT

## Dependencies

Dependencies are tracked with version ranges. We recommend:

- Running `npm audit` regularly
- Keeping dependencies up to date
- Reviewing dependency changes in PRs

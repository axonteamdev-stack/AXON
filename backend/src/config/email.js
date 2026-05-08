import nodemailer from "nodemailer";

const required = ["EMAIL_HOST", "EMAIL_PORT", "EMAIL_USER", "EMAIL_PASS"];
const missing = required.filter((key) => !process.env[key]);

// Mock transporter for tests
const mockTransporter = {
  sendMail: async () => ({ messageId: "test-mock", accepted: [] }),
  verify: async () => true,
};

export const transporter = missing.length && process.env.NODE_ENV === "test"
  ? mockTransporter
  : nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      pool: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === "production",
      },
    });

import pino from "pino";
import fs from "fs";
import path from "path";

const isDev = process.env.NODE_ENV === "development";
const logDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const allLogsStream = fs.createWriteStream(path.join(logDir, "app.log"), {
  flags: "a",
});
const errorLogsStream = fs.createWriteStream(path.join(logDir, "error.log"), {
  flags: "a",
});

const streams = [
  { stream: process.stdout, level: "info" },
  { stream: allLogsStream, level: "info" },
  { stream: errorLogsStream, level: "error" },
];

export const logger = pino(
  {
    level: process.env.LOG_LEVEL || "info",
    ...(isDev && {
      transport: {
        target: "pino-pretty",
        options: { colorize: true, translateTime: "HH:MM:ss Z" },
      },
    }),
  },
  pino.multistream(streams),
);

export const errorLogger = pino(
  {
    level: "error",
    transport: {
      target: "pino-pretty",
      options: { colorize: true, translateTime: "HH:MM:ss Z" },
    },
  },
  pino.multistream([{ stream: errorLogsStream, level: "error" }]),
);

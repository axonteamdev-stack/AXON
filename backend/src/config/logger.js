import pino from "pino";
import pinoMultiStream from "pino-multi-stream";
import fs from "fs";
import path from "path";

const { multistream } = pinoMultiStream;

const isDev = process.env.NODE_ENV === "development";
const logDir = path.join(process.cwd(), "logs");

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Pretty print for development console
const prettyStream = isDev
    ? {
        target: "pino-pretty",
        options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
        },
    }
    : undefined;

// File streams - one for all logs, one for errors only
const allLogsStream = fs.createWriteStream(
    path.join(logDir, "app.log"),
    { flags: "a" }
);

const errorLogsStream = fs.createWriteStream(
    path.join(logDir, "error.log"),
    { flags: "a" }
);

// Build streams array
const streams = [
    { stream: process.stdout, level: "info" },           // Console
    { stream: allLogsStream, level: "info" },            // All logs file
    { stream: errorLogsStream, level: "error" },         // Errors only file
];

export const logger = pino(
    {
        level: process.env.LOG_LEVEL || "info",
        ...(isDev && prettyStream ? { transport: prettyStream } : {}),
        base: {
            env: process.env.NODE_ENV,
            version: process.env.npm_package_version,
        },
    },
    multistream(streams)
);

export const requestLogger = (req, _res, next) => {
    req.log = logger.child({ requestId: req.requestId });
    req.log.info({ req: { method: req.method, url: req.url } }, "incoming request");
    next();
};
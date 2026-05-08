import pino from "pino";

const isDev = process.env.NODE_ENV === "development";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: isDev
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined,
  base: {
    env: process.env.NODE_ENV,
    version: process.env.npm_package_version,
  },
});

export const requestLogger = (req, _res, next) => {
  req.log = logger.child({ requestId: req.requestId });
  req.log.info({ req: { method: req.method, url: req.url } }, "incoming request");
  next();
};

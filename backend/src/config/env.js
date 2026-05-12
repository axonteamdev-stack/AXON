import dotenv from 'dotenv';
import path from 'path';

const REQUIRED_ENV = [
    "NODE_ENV",
    "PORT",
    "MONGO_URI",
    "JWT_SECRET",
    "REFRESH_SECRET",
    "JWT_EXPIRES_IN",
    "REFRESH_EXPIRES_IN",
    "APP_URL",
    "ALLOWED_ORIGINS",
];

export const validateEnvironment = () => {
    dotenv.config({
        path: path.resolve(process.cwd(), '.env'),
    });

    console.log(`Running in ${process.env.NODE_ENV || 'development'} mode`);

    const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
    if (missing.length) {
        throw new Error(`Missing environment variables: ${missing.join(", ")}`);
    }

    for (const secret of ["JWT_SECRET", "REFRESH_SECRET"]) {
        if (process.env[secret].length < 32) {
            throw new Error(`${secret} must be at least 32 characters`);
        }
    }
};

export const getEnv = (key, fallback) => process.env[key] || fallback;
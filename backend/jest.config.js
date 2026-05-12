/** @type {import('jest').Config} */
export default {
    // --- Environment & Execution ---
    testEnvironment: "node",
    setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
    globalTeardown: "<rootDir>/tests/teardown.js",
    testTimeout: 30000,
    maxWorkers: 1, // Vital for shared resources like databases
    detectOpenHandles: true, // Helps find why tests don't exit
    verbose: true,

    // --- Coverage Configuration ---
    coverageDirectory: "reports",
    collectCoverageFrom: [
        "controllers/**/*.js",
        "services/**/*.js",
        "middlewares/**/*.js",
        "models/**/*.js",
        "routes/**/*.js",
        "utils/**/*.js",
        "validators/**/*.js",
        "!**/node_modules/**",
        "!**/tests/**",
        "!**/reports/**",
    ],

    coverageThreshold: {
        global: {
            statements: 50,
            branches: 50,
            functions: 50,
            lines: 50,
        },
    },

    // --- Reporting ---
    reporters: [
        "default",
        [
            "jest-html-reporters",
            {
                publicPath: "./reports", // The directory where the report will live
                filename: "test-report.html", // The name of the file
                openReport: false, // Set to true if you want it to open in browser automatically
                inlineSource: true, // Keeps everything in one HTML file
                pageTitle: "Axon API Test Report",
            },
        ],
    ],

    // --- Module Handling (ESM) ---
    extensionsToTreatAsEsm: [],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    transform: {},
    transformIgnorePatterns: [
        "node_modules/(?!(mongodb-memory-server|@mongodb-js)/)",
    ],
};

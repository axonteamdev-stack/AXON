/** @type {import('jest').Config} */
export default {
    testEnvironment: "node",
    setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
    globalTeardown: "<rootDir>/tests/teardown.js",
    testTimeout: 30000,
    maxWorkers: 1,
    detectOpenHandles: true,
    verbose: true,

    coverageDirectory: "reports",
    collectCoverageFrom: [
        "src/controllers/**/*.js",
        "src/services/**/*.js",
        "src/middlewares/**/*.js",
        "src/models/**/*.js",
        "src/routes/**/*.js",
        "src/utils/**/*.js",
        "src/validators/**/*.js",
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

    reporters: [
        "default",
        [
            "jest-html-reporters",
            {
                publicPath: "./reports",
                filename: "test-report.html",
                openReport: false,
                inlineSource: true,
                pageTitle: "Axon API Test Report",
            },
        ],
    ],

    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    transform: {},
    transformIgnorePatterns: [
        "node_modules/(?!(mongodb-memory-server|@mongodb-js)/)",
    ],
};

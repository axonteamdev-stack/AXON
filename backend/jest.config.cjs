/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  testTimeout: 30000,
  maxWorkers: 1,
  detectOpenHandles: true,
  verbose: true,

  coverageDirectory: "reports",
  collectCoverageFrom: [
    "**/*.js",
    "!**/node_modules/**",
    "!**/tests/**",
    "!**/reports/**",
  ],

  reporters: [
    "default",
    [
      "jest-html-reporters",
      {
        publicPath: "./reports",
        filename: "test-report.html",
        inlineSource: true,
        expand: true,
      },
    ],
  ],

  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  transform: {},
};
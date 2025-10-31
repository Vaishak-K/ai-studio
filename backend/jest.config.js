module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.test.ts"],

  // Transform ES modules from node_modules
  transformIgnorePatterns: [
    "node_modules/(?!(uuid)/)", // Transform uuid package
  ],

  // Module mapper for ESM packages
  moduleNameMapper: {
    "^uuid$": "<rootDir>/node_modules/uuid/dist/index.js",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  // Transform configuration
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
  },

  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/index.ts"],

  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],

  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  verbose: true,
};

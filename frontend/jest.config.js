module.exports = {
  projects: [
    {
      displayName: "frontend",
      testEnvironment: "jsdom",
      testMatch: ["<rootDir>/src/**/*.test.{ts,tsx}"], // Changed
      preset: "ts-jest",
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1", // Changed
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
      },
      setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // Changed
      globals: {
        "ts-jest": {
          tsconfig: {
            jsx: "react-jsx",
          },
        },
      },
    },
    // ... backend config
  ],
};

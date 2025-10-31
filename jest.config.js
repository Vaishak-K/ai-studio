module.exports = {
  projects: [
    {
      displayName: "frontend",
      testEnvironment: "jsdom",
      testMatch: ["<rootDir>/frontend/src/**/*.test.{ts,tsx}"],
      preset: "ts-jest",
      roots: ["<rootDir>/frontend"],
      transform: {
        "^.+\\.tsx?$": [
          "ts-jest",
          {
            isolatedModules: true,
            diagnostics: {
              warnOnly: false,
              ignoreCodes: ["TS2339", "TS2307"], // Ignore these specific errors
            },
            tsconfig: {
              jsx: "react-jsx",
              esModuleInterop: true,
              allowSyntheticDefaultImports: true,
              skipLibCheck: true,
              noImplicitAny: false,
            },
          },
        ],
      },
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/frontend/src/$1",
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
      },
      setupFilesAfterEnv: ["<rootDir>/frontend/jest.setup.js"],
      moduleDirectories: ["node_modules", "<rootDir>/frontend/src"],
    },
    {
      displayName: "backend",
      testEnvironment: "node",
      testMatch: ["<rootDir>/backend/tests/**/*.test.{ts,tsx}"],
      preset: "ts-jest",
      transform: {
        "^.+\\.ts$": [
          "ts-jest",
          {
            isolatedModules: true,
            diagnostics: {
              ignoreCodes: ["TS2339", "TS2307"],
            },
            tsconfig: {
              esModuleInterop: true,
              allowSyntheticDefaultImports: true,
            },
          },
        ],
      },
    },
  ],
};

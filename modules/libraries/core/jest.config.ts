export default {
  displayName: {
    name: "core",
    color: "blue",
  },
  clearMocks: true,
  coverageDirectory: "<rootDir>/../__coverage",
  coverageProvider: "v8",
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  rootDir: "src",
  setupFilesAfterEnv: ["<rootDir>/@seedwork/domain/tests/validations.ts"],
  testRegex: ".*\\..*spec\\.ts$",
  transform: {
    "^.+\\.ts?$": ["@swc/jest"],
  },
};

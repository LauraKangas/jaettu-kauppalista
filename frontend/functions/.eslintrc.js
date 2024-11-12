module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "google",
  ],
  parserOptions: {
    sourceType: "module", // This ensures ES modules (e.g., `import` and `export`) are supported
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files
    "/generated/**/*", // Ignore generated files
    "/node_modules/**/*", // Ignore node_modules folder
  ],
  plugins: [
    "import", // Import plugin for linting imports
  ],
  rules: {
    "quotes": ["error", "double"], // Enforce double quotes
    "import/no-unresolved": 0, // Disable unresolved import rule
    "indent": ["error", 2], // Enforce 2-space indentation
  },
};

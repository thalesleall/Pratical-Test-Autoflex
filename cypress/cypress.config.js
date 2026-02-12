const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "tests/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "support/e2e.js",
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    env: {
      apiUrl: "https://autoflexapi.thalesleal.icu",
    },
  },
});

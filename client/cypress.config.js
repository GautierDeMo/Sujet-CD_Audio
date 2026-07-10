import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,

  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:5173',
    specPattern: 'tests/e2e/cypress/e2e/*.cy.js',
    supportFile: 'tests/e2e/cypress/support/e2e.js',
    fixturesFolder: 'tests/e2e/cypress/fixtures'
  },

});

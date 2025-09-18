import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,

    // Configuraciones más agresivas para memoria
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 0, // Cambiar de 1 a 0 - no mantener ningún test en memoria

    // Configuraciones adicionales para estabilidad
    defaultCommandTimeout: 15000, // Aumentar timeout
    requestTimeout: 15000,
    responseTimeout: 15000,
    pageLoadTimeout: 30000,

    video: false,
    screenshotOnRunFailure: true,

    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    fixturesFolder: 'cypress/fixtures',

    retries: {
      runMode: 0, // Sin retry para ver errores reales
      openMode: 0,
    },

    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });

      // Configuración más conservadora
      config.video = false;
      config.screenshotOnRunFailure = true;
      config.numTestsKeptInMemory = 0; // Forzar 0 en todos los ambientes

      return config;
    },
  },

  chromeWebSecurity: false,
  modifyObstructiveCode: false,
  scrollBehavior: 'center',
  animationDistanceThreshold: 20,
  reporter: 'spec',
});

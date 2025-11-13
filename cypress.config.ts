import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // URL base de tu aplicación
    baseUrl: "http://localhost:3000",
    
    // Configuración de viewport
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Configuración de medios
    video: false, // Desactivar videos para desarrollo
    screenshotOnRunFailure: true,
    
    // Timeouts
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    
    // Patrones de archivos
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    
    // Variables de entorno
    env: {
      apiUrl: "http://localhost:3000/api"
    },
    
    setupNodeEvents(on, config) {
      // Aquí puedes configurar plugins
    },
  },
});
// cypress/support/commands.ts
import 'cypress-file-upload';


/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Inicia sesión con credenciales de usuario
       */
      login(email: string, password: string): Chainable<void>;
    }
  }
}

export {};


Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login'); // o la ruta donde esté tu página de login

  // Los selectores dependen de tu HTML real
  cy.get('input[placeholder="tu@gmail.com"]').type(email);
  cy.get('input[placeholder="Contraseña"]').type(password);
  cy.get('button[type="submit"]').click();
});
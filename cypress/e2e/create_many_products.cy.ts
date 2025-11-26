/// <reference types="cypress" />

// cypress/e2e/create_many_products.cy.ts
// Cypress test: create many products using the product creation form

// This test uses the existing custom `cy.login(email, password)` command to authenticate the user
// It intercepts the upload endpoint (`POST /api/upload`) and returns a fake URL to speed the test
// It uses in-browser File/Blob APIs to attach a minimal PNG to the file input without requiring a plugin.

const COUNT = Number(Cypress.env('CREATE_PRODUCT_COUNT') || 10);
const E2E_EMAIL = Cypress.env('E2E_USER_EMAIL') || 'luis@example.com';
const E2E_PASSWORD = Cypress.env('E2E_USER_PASSWORD') || 'luis123';

// Tiny 1x1 PNG base64 (valid) to use in the test
const ONE_PIXEL_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8AABwMB/wNC3gAAAABJRU5ErkJggg==';

function attachBase64File(selector: string, base64String: string, fileName = 'product.png', mimeType = 'image/png') {
  cy.get(selector).should('exist').then(($input) => {
    const input = $input[0] as HTMLInputElement;
    const doc = input.ownerDocument;
    const win = doc.defaultView as any; // window del AUT

    // Convertimos base64 a blob usando el helper de Cypress.
    const maybeBlob = Cypress.Blob.base64StringToBlob(base64String, mimeType) as any;
    // `maybeBlob` puede ser un Blob o una Promise<Blob> dependiendo de la versión,
    // así que manejamos ambos casos con el mejor tipo para evitar errores de TS.
    if (maybeBlob && typeof maybeBlob.then === 'function') {
      cy.wrap(maybeBlob).then((blob: Blob) => {
        const file = new win.File([blob], fileName, { type: mimeType });
        const dataTransfer = new win.DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;

        // Trigger event en el DOM del AUT
        const event = new win.Event('change', { bubbles: true });
        input.dispatchEvent(event);
      });
    } else {
      const blob: Blob = maybeBlob as Blob;
      const file = new win.File([blob], fileName, { type: mimeType });
      const dataTransfer = new win.DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;

      // Trigger event en el DOM del AUT
      const event = new win.Event('change', { bubbles: true });
      input.dispatchEvent(event);
    }
  });
}

describe('Create many products via UI form', () => {
  before(() => {
    cy.login(E2E_EMAIL, E2E_PASSWORD);
    cy.url().should('include', '/dashboard');
  });

  it(`creates ${COUNT} products using the UI`, () => {
    Cypress._.times(COUNT, (i) => {
      const productName = `E2E Product ${Date.now()}-${i}`;
      const brand = `Brand ${i}`;
      const price = `${Math.floor(Math.random() * 200 + 10)}`;
      const quantity = `${Math.floor(Math.random() * 10 + 1)}`;
      const categoryOptions = ['Electrónica', 'Computadores', 'Accesorios', 'Audio', 'Gaming'];
      const category = categoryOptions[i % categoryOptions.length];

      // intercept upload and stub Cloudinary like response (fast, deterministic)
      cy.intercept('POST', '/api/upload', {
        statusCode: 200,
        body: { url: `https://res.cloudinary.com/demo/image/upload/e2e-${Date.now()}-${i}.jpg` },
      }).as('upload');

      // watch for product creation call
      cy.intercept('POST', '/api/products').as('createProduct');

      // Visit create page
      cy.visit('/dashboard/products/new');

      // Fill the form
      cy.get('input[name="name"]').clear().type(productName);
      cy.get('input[name="brand"]').clear().type(brand);
      cy.get('input[name="price"]').clear().type(price);
      cy.get('input[name="quantity"]').clear().type(quantity);
      cy.get('select[name="category"]').select(category);

      // attach the small png to file input (triggers the FileReader + upload)
      attachBase64File('input[type="file"]', ONE_PIXEL_PNG_BASE64, `product-${i}.png`);

      // submit the form
      cy.get('form').within(() => {
        cy.get('button[type="submit"]').click();
      });

      // wait for upload and create HTTP calls
      cy.wait('@upload', { timeout: 10000 });
      cy.wait('@createProduct', { timeout: 10000 }).its('response.statusCode').should('be.oneOf', [200, 201]);

      // should redirect to products list after a successful create
      cy.url({ timeout: 10000 }).should('include', '/dashboard/products');

      // optional: check the created product appears in the list (depends on backend ordering)
      // we search by product name inside the grid/cards; if not found immediately you can 
      // refine by re-fetching or waiting a bit for the list refresh.
      cy.contains(productName, { timeout: 5000 }).should('exist');
    });
  });
});

describe('Login de usuario', () => {
  it('debería iniciar sesión correctamente con credenciales válidas', () => {
    // Aquí debes usar un usuario real de prueba que exista en tu base de datos o mock
    const email = 'luis@example.com';
    const password = 'luis123';

    cy.login(email, password);

    // Verificamos que redirija al dashboard
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');
  });

  it('debería mostrar error si las credenciales son inválidas', () => {
    cy.login('correo@invalido.com', 'ClaveIncorrecta');
    cy.contains('CredentialsSignin').should('be.visible'); // ajusta el texto al mensaje real
  });
});


it('debería mostrar el botón de login con Google', () => {
  cy.visit('/login');
  cy.contains('Login con Google').should('be.visible');
});

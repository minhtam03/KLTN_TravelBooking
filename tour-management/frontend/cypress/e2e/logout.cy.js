describe('Logout Functionality', () => {
  beforeEach(() => {
    const email = 'test19@gmail.com';
    const password = '123456';

    cy.visit('/login');
    cy.get('input[id="email"]').type(email);
    cy.get('input[id="password"]').type(password);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/home');
  });

  it('should log out successfully and redirect to Home screen', () => {
    cy.visit('/home');
    cy.get('.profile-container').click();
    cy.get('.logout-btn').click();
    cy.url().should('include', '/home');

  });
});

describe('Tour Booking History', () => {
  const email = 'test19@gmail.com';
  const password = '123456';

  before(() => {
    cy.visit('/login');
    cy.get('#email').type(email);
    cy.get('#password').type(password);
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('not.include', '/login');
  });

  it('should display at least one tour booking in history', () => {
    cy.visit('/booking/tour');

    // Chờ loading kết thúc
    cy.contains('Loading...', { timeout: 10000 }).should('not.exist');

    // Kiểm tra ít nhất 1 BookingCard hiển thị
    cy.get('[data-testid="booking-card"]', { timeout: 10000 }).should('have.length.at.least', 1);

    // Kiểm tra nội dung 1 thẻ booking đầu tiên
    cy.get('[data-testid="booking-card"]').first().within(() => {
      cy.contains(/Tour Date/i);
      cy.contains(/Guests/i);
      cy.contains(/Total:/i);
      cy.contains(/Status:/i);
    });
  });
});
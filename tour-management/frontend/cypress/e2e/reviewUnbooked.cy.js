describe('Restrict review form for users who have not booked the tour', () => {
  const email = 'test19@gmail.com';
  const password = '123456';

  before(() => {
    // Đăng nhập với tài khoản chưa từng đặt tour
    cy.visit('/login');
    cy.get('#email').type(email);
    cy.get('#password').type(password);
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('not.include', '/login');
  });

  it('should NOT show review form', () => {
    cy.visit('/tours/681254d1d1429ddd7ce92a2a');

    // Đảm bảo đã vào trang tour
    cy.contains('Information', { timeout: 10000 }).should('exist');

    // Không hiển thị ô đánh giá
    cy.get('[data-testid="review-text"]').should('not.exist');
    cy.get('[data-testid="submit-review"]').should('not.exist');

    // Hiển thị cảnh báo
    // cy.contains('You must book this tour to leave a review.').should('be.visible');
  });
});
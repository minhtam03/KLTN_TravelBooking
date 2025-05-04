describe('Submit review for booked tour', () => {
  const email = 'test19@gmail.com';
  const password = '123456';
  const comment = 'This was an amazing experience!';

  before(() => {
    cy.visit('/login');
    cy.get('#email').type(email);
    cy.get('#password').type(password);
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('not.include', '/login');
  });

  it('should allow rating and submitting a review', () => {
    cy.visit('/tours/681255f5d1429ddd7ce92a3c');

    // Chờ form review hiện ra
    // cy.contains('Share your thoughts').should('be.visible');

    cy.get('[data-testid="rating-star-4"]').click();

    // Nhập comment
    cy.get('[data-testid="review-text"]').type(comment);

    // Theo dõi POST request gửi đánh giá
    cy.intercept('POST', '**/review').as('submitReview');

    // Gửi đánh giá
    cy.get('[data-testid="submit-review"]').click();

    // Đợi gửi thành công
    cy.wait('@submitReview').its('response.statusCode').should('eq', 200);

    // Kiểm tra alert hoặc xuất hiện review mới
    cy.contains(comment).should('be.visible');
  });
});

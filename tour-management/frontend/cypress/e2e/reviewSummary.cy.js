describe('Review Summary Display', () => {
  it('should display review summary sections when tour has reviews', () => {
    // Truy cập trang tour có review
    cy.visit('/tours/681255f5d1429ddd7ce92a3c');

    // Kiểm tra trang đã load
    cy.contains('Information', { timeout: 10000 }).should('exist');

    // Chờ phần summary xuất hiện
    cy.contains('Positive Reviews:', { timeout: 10000 }).should('be.visible');
    cy.contains('Negative Reviews:').should('be.visible');
    cy.contains('Overall Impression:').should('be.visible');

    // Kiểm tra nội dung tóm tắt có hiển thị đoạn text nào đó
    cy.get('div').contains('Positive Reviews:').next('p').should('not.be.empty');
    cy.get('div').contains('Negative Reviews:').next('p').should('not.be.empty');
    cy.get('div').contains('Overall Impression:').next('p').should('not.be.empty');
  });

  it('should show loading or fallback message when no summary available', () => {
    // Truy cập tour KHÔNG có review nào
    cy.visit('/tours/68125537d1429ddd7ce92a30');

    // Kiểm tra dòng fallback hiện ra
    cy.contains('No reviews yet').should('be.visible');
  });
});
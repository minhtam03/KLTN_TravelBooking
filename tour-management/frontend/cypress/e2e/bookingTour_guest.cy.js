describe('Tour Booking without Login', () => {
  it('should prevent booking when user is not logged in', () => {
    // Xoá cookie/token để đảm bảo trạng thái khách
    cy.clearCookies();

    // Truy cập trang tour chi tiết
    cy.visit('/tours/681255f5d1429ddd7ce92a3c');
    cy.contains('Information', { timeout: 10000 }).should('exist');

    // Điền thông tin booking
    cy.get('#fullName').type('Guest User');
    cy.get('#phone').type('0123456789');
    const today = new Date().toISOString().split('T')[0];
    cy.get('#bookAt').type(today);
    cy.get('#guestSize').clear().type('2');

    // Theo logic BookingForm, nếu chưa có `user`, sẽ hiển thị alert
    // nên ta cần theo dõi window:alert
    const stub = cy.stub();
    cy.on('window:alert', stub);

    cy.contains('Book Now').click().then(() => {
      expect(stub).to.have.been.calledWith('Please sign in');
    });
  });
});
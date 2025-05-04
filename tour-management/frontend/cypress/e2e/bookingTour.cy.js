describe('Tour Booking Flow (with cookie)', () => {

  it('books a tour successfully when logged in', () => {
    const email = 'test19@gmail.com';
    const password = '123456';

    // Truy cập trang đăng nhập
    cy.visit('/login');

    // Điền thông tin đăng nhập
    cy.get('input[id="email"]').type(email);  // Điền email
    cy.get('input[id="password"]').type(password);  // Điền mật khẩu

    // Nhấn nút đăng nhập
    cy.get('button[type="submit"]').click();

    // Đợi và click "Tours"
    cy.contains('Tours', { timeout: 10000 }).should('be.visible').click();
    cy.wait(1000);
    // Đợi và click tên tour
    cy.contains('Floating Vibes of Can Tho', { timeout: 10000 }).should('be.visible').click();
    cy.wait(1000);
    cy.url({ timeout: 10000 }).should('include', '681255f5d1429ddd7ce92a3c');
    // cy.visit('http://localhost:3000/tours/681255f5d1429ddd7ce92a3c');
    cy.contains('Information', { timeout: 10000 }).should('exist');

    cy.get('#fullName').type('Nguyen Van D');
    cy.get('#phone').type('0123456789');
    const today = new Date().toISOString().split('T')[0];
    cy.get('#bookAt').type(today);
    cy.get('#guestSize').clear().type('2');

    // Gửi yêu cầu đặt tour
    cy.intercept('POST', '**/payments').as('createPayment');

    cy.contains('Book Now').should('not.be.disabled').click();

    cy.wait('@createPayment').then((interception) => {
      const redirectUrl = interception.response.body.session.url;
      expect(redirectUrl).to.include('https://checkout.stripe.com');
    });
  });
});

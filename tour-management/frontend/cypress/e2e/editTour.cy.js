describe('Admin Edit Tour', () => {
  const email = 'testadmin@gmail.com'; // giả định là admin
  const password = '123456';

  before(() => {
    cy.visit('/login');
    cy.get('#email').type(email);
    cy.get('#password').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
  });

  it('should allow admin to edit a tour title and save successfully', () => {
    // 1. Truy cập trang danh sách tour
    cy.visit('/admin/tours');

    // 2. Click nút Edit đầu tiên
    cy.get('button[title="Edit"]').first().click();

    // 3. Chờ form edit load và sửa trường Title
    cy.get('input[name="title"]', { timeout: 10000 }).should('be.visible').clear().type('Updated Beach Tour Title');

    // 4. Click nút Update
    cy.intercept('PUT', '**/tours/**').as('updateTour');
    cy.contains('Update').click();

    // 5. Kiểm tra gọi API và alert thành công
    cy.wait('@updateTour').its('response.statusCode').should('eq', 200);

    // 6. Xác minh redirect về /admin/tours
    cy.url({ timeout: 10000 }).should('include', '/admin/tours');
  });
});
describe('Suggestion Form & Result Flow', () => {
  const email = 'new@gmail.com';
  const password = '123456';

  beforeEach(() => {
    cy.visit('/login');
    cy.get('#email').type(email);
    cy.get('#password').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
    cy.visit('/suggestion'); // thay đường dẫn nếu khác
  });

  it('fills in suggestion form and submits successfully', () => {
    // Nhập form
    cy.get('[data-testid="input-budget"]').type('2000');
    cy.get('[data-testid="input-duration"]').type('3');

    // Chọn Departure
    cy.get('[data-testid="select-departure"]').click();
    cy.get('[data-testid="city-depart-Ha Noi"]').click();
    // thay bằng thành phố có thật trong list

    // Chọn Destination
    cy.get('[data-testid="select-destination"]').click();
    cy.get('[data-testid="city-dest-Hue"]').click();

    // Chọn ngày khởi hành
    const today = new Date().toISOString().split('T')[0];
    cy.get('[data-testid="input-start-date"]').type(today);

    // Click button Suggest
    cy.get('[data-testid="input-suggest"]').click();

    // Chờ kết quả hiện ra
    cy.contains('Results', { timeout: 10000 }).should('be.visible');
    cy.wait(5000);
    // Kiểm tra tour đã được gợi ý
    cy.get('[data-testid="select-tour"]').click();

    cy.wait(200);

    // Chọn option đầu tiên
    cy.get('body').find('ul[role="listbox"] > li').first().click();
  });
});
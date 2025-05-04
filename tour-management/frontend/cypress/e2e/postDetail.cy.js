describe('Post Detail Display and Like Functionality', () => {
  const email = 'test19@gmail.com';
  const password = '123456';
  const postId = '68118548ceabf4b989e4c94f'; // 👈 Thay bằng ID bài viết thật trong DB bạn

  before(() => {
    // Đăng nhập
    cy.visit('/login');
    cy.get('#email').type(email);
    cy.get('#password').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
  });

  it('should display post content correctly', () => {
    cy.visit(`/blog/${postId}`);

    // Tiêu đề bài viết
    cy.get('h4').should('be.visible');

    // Ngày tạo
    cy.get('.MuiChip-label').should('contain.text', '/'); // ngày dạng dd/mm/yyyy

    // Nội dung post
    cy.get('div').contains(/.+/).should('exist'); // hoặc kiểm tra đoạn content cụ thể
  });

  it('should toggle like on button click', () => {
    cy.visit('/login');
    cy.get('#email').type(email);
    cy.get('#password').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
    cy.visit(`/blog/${postId}`);

    // Intercept PATCH like API
    cy.intercept('PATCH', `**/posts/${postId}/like`).as('likePost');

    // Lấy số lượt like hiện tại từ nút like
    cy.get('[data-testid="like-button"]')
      .invoke('text')
      .then((textBefore) => {
        const beforeLikeCount = parseInt(textBefore.trim(), 10);

        // Click Like
        cy.get('[data-testid="like-button"]').click();

        // Chờ request gửi đi
        cy.wait('@likePost').its('response.statusCode').should('eq', 200);

        // Kiểm tra lượt like sau khi click
        cy.get('[data-testid="like-button"]')
          .invoke('text')
          .then((textAfter) => {
            const afterLikeCount = parseInt(textAfter.trim(), 10);
            expect(Math.abs(afterLikeCount - beforeLikeCount)).to.eq(1);
          });
      });
  });

});

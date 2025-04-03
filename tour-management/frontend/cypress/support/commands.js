Cypress.Commands.add('login', (email, password) => {
    cy.session(email, () => {
        cy.visit('/login')  // Truy cập trang login

        // Điền thông tin đăng nhập
        cy.get('input[id=email]').type(email)
        cy.get('input[id=password]').type(`${password}{enter}`, { log: false })

        // Đảm bảo trang chuyển đến /home sau khi đăng nhập thành công
        cy.url().should('include', '/home')
    }, {
        // Xác minh cookie tồn tại để đảm bảo đăng nhập thành công
        validate: () => {
            cy.getCookie('accessToken').should('exist')
        }
    })
})

describe('Register Functionality', () => {
  // Test đăng ký với thông tin hợp lệ
  // it('Register successfully with valid information', () => {
  //   const username = 'test02041'
  //   const email = 'test02041@gmail.com';
  //   const password = '123456';

  //   // Truy cập trang đăng ký
  //   cy.visit('/register');

  //   // Điền thông tin đăng ký
  //   cy.get('input[id="username"]').type(username);
  //   cy.get('input[id="email"]').type(email);
  //   cy.get('input[id="password"]').type(password);

  //   // Nhấn nút đăng ký
  //   cy.get('button[type="submit"]').click();

  //   // Kiểm tra xem có chuyển hướng đến trang Home sau khi đăng ký thành công không
  //   cy.url().should('include', '/login');

  // });

  // Test đăng ký với email đã tồn tại
  it('should show error message when email already exists', () => {
    const username = 'test02041';
    const email = 'test19@gmail.com'; // Email đã tồn tại
    const password = '123456';

    // Truy cập trang đăng ký
    cy.visit('/register');

    // Điền thông tin đăng ký
    cy.get('input[id="username"]').type(username);
    cy.get('input[id="email"]').type(email);
    cy.get('input[id="password"]').type(password);

    // Nhấn nút đăng ký
    cy.get('button[type="submit"]').click();

    cy.on('window:alert', (alertText) => {
      // Kiểm tra thông báo alert
      expect(alertText).to.contains('Failed to create. Try again');
    });
  });

  // // Test đăng ký với email không hợp lệ
  // it('should show error message for invalid email format', () => {
  //   const email = 'invalidemail.com'; // Email không hợp lệ
  //   const password = '123456';
  //   const confirmPassword = '123456';

  //   // Truy cập trang đăng ký
  //   cy.visit('/register');

  //   // Điền thông tin đăng ký
  //   cy.get('input[id="email"]').type(email);
  //   cy.get('input[id="password"]').type(password);
  //   cy.get('input[id="confirmPassword"]').type(confirmPassword);

  //   // Nhấn nút đăng ký
  //   cy.get('button[type="submit"]').click();

  //   // Kiểm tra thông báo lỗi
  //   cy.contains('Invalid email format').should('be.visible');
  // });

  // // Test đăng ký khi email hoặc mật khẩu để trống
  // it('should show error message when email or password is empty', () => {
  //   const email = ''; // Email trống
  //   const password = '123456';
  //   const confirmPassword = '123456';

  //   // Truy cập trang đăng ký
  //   cy.visit('/register');

  //   // Để trống email và điền mật khẩu
  //   cy.get('input[id="email"]').type(email);
  //   cy.get('input[id="password"]').type(password);
  //   cy.get('input[id="confirmPassword"]').type(confirmPassword);

  //   // Nhấn nút đăng ký
  //   cy.get('button[type="submit"]').click();

  //   // Kiểm tra thông báo lỗi
  //   cy.contains('Email and password are required').should('be.visible');
  // });
});

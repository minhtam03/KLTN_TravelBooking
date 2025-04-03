// describe('Login Functionality', () => {
//   // Đảm bảo rằng chúng ta không phải đăng nhập lại mỗi lần chạy bài kiểm thử
//   beforeEach(() => {
//     const email = 'test19@gmail.com'
//     const password = '123456'

//     // Sử dụng lệnh login đã định nghĩa trước đó để đăng nhập
//     cy.login(email, password)
//   })

//   it('should login successfully with valid credentials', () => {

//     // Kiểm tra xem người dùng có được chuyển đến trang dashboard sau khi đăng nhập không
//     cy.url().should('include', '/home')  // Hoặc URL của trang sau khi đăng nhập thành công
//     cy.get('h1').should('contain', 'Welcome')  // Kiểm tra xem tên người dùng có được hiển thị
//   })

// })


describe('Login Functionality', () => {
  // beforeEach(() => {
  //   // Trước mỗi bài kiểm thử, thực hiện đăng nhập
  //   const email = 'test19@gmail.com';
  //   const password = '123456';

  //   // Truy cập trang đăng nhập
  //   cy.visit('/login');

  //   // Điền thông tin đăng nhập
  //   cy.get('input[id="email"]').type(email);  // Điền email
  //   cy.get('input[id="password"]').type(password);  // Điền mật khẩu

  //   // Nhấn nút đăng nhập
  //   cy.get('button[type="submit"]').click();
  // });

  it('login successfully with valid credentials', () => {
    const email = 'test19@gmail.com';
    const password = '123456';

    // Truy cập trang đăng nhập
    cy.visit('/login');

    // Điền thông tin đăng nhập
    cy.get('input[id="email"]').type(email);  // Điền email
    cy.get('input[id="password"]').type(password);  // Điền mật khẩu

    // Nhấn nút đăng nhập
    cy.get('button[type="submit"]').click();
    // Kiểm tra xem người dùng có được chuyển đến trang dashboard sau khi đăng nhập không
    cy.url().should('include', '/home');  // Hoặc URL của trang sau khi đăng nhập thành công

  });

  it('show an error message for invalid email', () => {
    // Đăng nhập với thông tin sai
    const invalidEmail = 'invalidemail@gmail.com';
    const invalidPassword = 'wrongpassword';

    // Truy cập lại trang đăng nhập
    cy.visit('/login');

    // Điền thông tin đăng nhập sai
    cy.get('input[id="email"]').type(invalidEmail);
    cy.get('input[id="password"]').type(invalidPassword);
    cy.get('button[type="submit"]').click();

    // Kiểm tra thông báo lỗi
    cy.on('window:alert', (alertText) => {
      // Kiểm tra thông báo alert
      expect(alertText).to.contains('User not found');
    });
  });

  it('show an error message for wrong password', () => {
    // Đăng nhập với thông tin sai
    const invalidEmail = 'test19@gmail.com';
    const invalidPassword = 'wrongpassword';

    // Truy cập lại trang đăng nhập
    cy.visit('/login');

    // Điền thông tin đăng nhập sai
    cy.get('input[id="email"]').type(invalidEmail);
    cy.get('input[id="password"]').type(invalidPassword);
    cy.get('button[type="submit"]').click();

    // Kiểm tra thông báo lỗi
    cy.on('window:alert', (alertText) => {
      // Kiểm tra thông báo alert
      expect(alertText).to.contains('Incorrect email or password');
    });
  });


  it('Not login if email or password is empty', () => {
    // Kiểm tra khi email hoặc mật khẩu để trống
    cy.visit('/login');

    const inputField = cy.get('input[id="email"]');
    // Để trống email và mật khẩu
    cy.get('button[type="submit"]').click();

    // Kiểm tra xem thông báo lỗi có xuất hiện không
    inputField.then((input) => {
      const errorMessage = input[0].validationMessage;
      expect(errorMessage).to.equal('Please fill out this field.');
    });
  });


});

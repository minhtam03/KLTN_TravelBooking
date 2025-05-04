// describe('Search Functionality with Location, Distance, and Max People', () => {
//   // Test tìm kiếm với Location, Distance, và Max People hợp lệ
//   it('should display tours based on Location, Distance, and Max People', () => {
//     const location = 'Hai Phong';
//     const distance = '100'; // 500 km
//     const maxPeople = '4'; // 4 people

//     // Truy cập trang Tours
//     cy.visit('/tours');

//     // Điền Location
//     cy.get('input[placeholder="Where are you going"]').type(location);

//     // Điền Distance
//     cy.get('input[placeholder="Distance k/m"]').type(distance);

//     // Điền Max People
//     cy.get('input[placeholder="0"]').clear().type(maxPeople);

//     // Nhấn nút tìm kiếm (biểu tượng tìm kiếm)
//     cy.get('.search__icon').click();

//     // Kiểm tra kết quả tìm kiếm có liên quan đến Location, Distance và Max People không
//     cy.url().should('include', 'search');  // Kiểm tra xem URL có chứa 'search' không
//     cy.get('.tour__card').should('have.length.greaterThan', 0);

//   });

//   // Test tìm kiếm với Location, Distance hoặc Max People không hợp lệ
//   it('should show no results when Location, Distance or Max People is invalid', () => {
//     const location = 'Atlantis';  // Location không hợp lệ
//     const distance = '1000';  // Distance không hợp lý
//     const maxPeople = '1000';  // Max people không hợp lý

//     // Truy cập trang Tours
//     cy.visit('/tours');

//     // Điền Location không hợp lệ, Distance không hợp lý và Max People không hợp lý
//     cy.get('input[placeholder="Where are you going"]').type(location);
//     cy.get('input[placeholder="Distance k/m"]').type(distance);
//     cy.get('input[placeholder="0"]').clear().type(maxPeople);

//     // Nhấn nút tìm kiếm
//     cy.get('.search__icon').click();

//     // Kiểm tra thông báo "No results found"
//     cy.contains('No tour found').should('be.visible');
//     cy.get('.tour__card').should('have.length', 0);  // Kiểm tra không có kết quả nào được hiển thị
//   });


// });


describe('Search Functionality with Location, Duration, and Max Group Size', () => {
  it('should display results when search input is valid', () => {
    const location = 'Hai Phong';
    const duration = '2';
    const maxGroupSize = '4';

    cy.visit('/tours');

    // Chọn location từ dropdown
    cy.get('[data-testid="location-select"]').click();

    // Chọn thành phố từ danh sách
    cy.get('[data-testid="city-Hai Phong"]').click();


    // Điền Duration
    cy.get('input[placeholder="How long"]').type(duration);

    // Điền Max Group Size
    cy.get('input[placeholder="How many guests"]').clear().type(maxGroupSize);

    // Click nút tìm kiếm
    cy.get('button').find('svg[data-testid="SearchIcon"]').click();

    // Chờ kết quả tìm kiếm
    cy.url().should('include', '/tours/search');
    cy.get('[data-testid="tour-card"]', { timeout: 10000 }).should('have.length.greaterThan', 0);
  });

  it('should show "No tour found" when search input is invalid', () => {
    const location = 'Atlantis';
    const duration = '999';
    const maxGroupSize = '999';

    cy.visit('/tours');

    // Chọn location từ dropdown
    cy.get('[data-testid="location-select"]').click();

    // Chọn thành phố từ danh sách
    cy.get('[data-testid="city-Hai Phong"]').click();
    // Duration và Group Size không hợp lệ
    cy.get('input[placeholder="How long"]').type(duration);
    cy.get('input[placeholder="How many guests"]').clear().type(maxGroupSize);

    // Click search
    cy.get('button').find('svg[data-testid="SearchIcon"]').click();

    // Kết quả không có tour
    cy.contains('No tour found', { timeout: 10000 }).should('be.visible');
    cy.get('.tour__card').should('have.length', 0);
  });
});

export const userInputs = [
    {
        id: "username",
        label: "Username",
        type: "text",
        placeholder: "john_doe",
    },
    {
        id: "email",
        label: "Email",
        type: "email",
        placeholder: "john_doe@gmail.com",
    },
    {
        id: "password",
        label: "Password",
        type: "password",
    },
    {
        id: "role",
        label: "Role",
        type: "text",
        placeholder: "user",
    },
];

export const tourInputs = [
    {
        id: "title",
        label: "Title",
        type: "text",
        placeholder: "Amazing Beach Tour",
        name: "title",
    },
    // {
    //     id: "city",
    //     label: "City",
    //     type: "text",
    //     placeholder: "New York",
    //     name: "city",
    // },
    {
        id: "city",
        label: "City",
        type: "select",  // <-- Chuyển sang dropdown
        name: "city",
        options: [
            'Ha Noi', 'Ho Chi Minh', 'Da Nang', 'Hai Phong', 'Can Tho',
            'Binh Duong', 'Bac Ninh', 'Vinh', 'Hue', 'Long An', 'Nghe An',
            'Bac Giang', 'Quang Ninh', 'Nam Dinh', 'Thanh Hoa', 'Quang Binh',
            'Son La', 'Tien Giang', 'Vinh Long', 'Dak Lak', 'Binh Thuan',
            'Quang Tri', 'Lam Dong', 'An Giang', 'Ninh Binh', 'Tay Ninh',
            'Ben Tre', 'Kien Giang', 'Dong Nai', 'Gia Lai', 'Bac Lieu',
            'Phu Tho', 'Ca Mau', 'Hau Giang', 'Binh Phuoc', 'Ha Giang',
            'Soc Trang', 'Dak Nong', 'Thanh Hoa', 'Lai Chau', 'Ha Tinh',
            'Khanh Hoa', 'Yen Bai', 'Quang Nam', 'Nghe An', 'Bac Kan',
            'Quang Ngai', 'Lang Son', 'Nam Dinh', 'Thai Nguyen', 'Hoa Binh',
            'Quang Binh', 'Tuyen Quang', 'Hien Giang', 'Long An', 'Lam Dong',
            'Sapa', 'Hung Yen', 'Bac Giang', 'Tuyen Quang', 'Quang Tri'
        ]
    },
    {
        id: "address",
        label: "Address",
        type: "text",
        placeholder: "123 Main Street",
        name: "address",
    },
    {
        id: "distance",
        label: "Distance (km)",
        type: "number",
        placeholder: "10",
        name: "distance",
    },
    // {
    //     id: "photo",
    //     label: "Photo URL",
    //     type: "text",
    //     placeholder: "https://example.com/tour.jpg",
    //     name: "photo",
    // },
    {
        id: "desc",
        label: "Description",
        type: "textarea",
        placeholder: "A beautiful tour with amazing experiences...",
        name: "desc",
    },
    {
        id: "duration",
        label: "Duration (days)",
        type: "number",
        placeholder: "5",
        name: "duration",
    },
    {
        id: "price",
        label: "Price ($)",
        type: "number",
        placeholder: "250",
        name: "price",
    },
    {
        id: "maxGroupSize",
        label: "Max Group Size",
        type: "number",
        placeholder: "15",
        name: "maxGroupSize",
    },
    {
        id: "featured",
        label: "Featured",
        type: "checkbox",
        name: "featured",
    },
];

export const postInputs = [
    {
        id: "title",
        label: "Title",
        type: "text",
        placeholder: "Enter blog title...",
        name: "title",
    },
    {
        id: "content",
        label: "Content",
        type: "textarea",
        placeholder: "Write your blog content here...",
        name: "content",
    },
    {
        id: "author",
        label: "Author",
        type: "text",
        placeholder: "John Doe",
        name: "author",
    },

];


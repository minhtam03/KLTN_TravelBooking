
export const userColumns = [
    { field: '_id', headerName: 'ID', width: 200 },
    { field: 'username', headerName: 'User Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'role', headerName: 'Role', width: 150 },
]

export const tourColumns = [
    { field: '_id', headerName: 'ID', width: 120 },
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'city', headerName: 'City', width: 150 },
    { field: 'address', headerName: 'Address', width: 150 },
    { field: 'price', headerName: 'Price ($)', width: 120 },
]

export const hotelColumns = [
    { field: '_id', headerName: 'ID', width: 120 },
    { field: 'name', headerName: 'Hotel Name', width: 200 },
    { field: 'city', headerName: 'City', width: 150 },
    { field: 'rating', headerName: 'Rating', width: 100 },
]

export const bookingColumns = [
    { field: '_id', headerName: 'ID', width: 200 },
    { field: 'userEmail', headerName: 'User Email', width: 200 },
    { field: 'tourName', headerName: 'Tour Name', width: 200 },
    { field: 'fullName', headerName: 'Full Name', width: 180 },
    { field: 'guestSize', headerName: 'Guest Size', width: 150, type: 'number' },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'bookAt', headerName: 'Booking Date', width: 180, type: 'date' },
    {
        field: 'paymentStatus',
        headerName: 'Payment Status',
        width: 150,
        renderCell: (params) => {
            let color = "gray";
            if (params.value === "paid") color = "green";
            else if (params.value === "pending") color = "goldenrod";
            else if (params.value === "failed") color = "red";

            return (
                <span style={{ color, fontWeight: "bold" }}>
                    {params.value.toUpperCase()}
                </span>
            );
        }
    }
];

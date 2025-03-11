import { dividerClasses } from "@mui/material";
import { format } from "date-fns";

export const userColumns = [
    { field: '_id', headerName: 'ID', width: 200 },
    {
        field: 'username', headerName: 'User Name', width: 200,
        renderCell: (params) => {
            return (
                <div className="cellWithImg">
                    <img className="cellImg" src={params.row.photo || "https://t4.ftcdn.net/jpg/08/75/45/97/360_F_875459719_8i7J3atGbsDoRPT0ZW0DjBpgAFVTrKAe.jpg"} alt="avatar" />
                    {params.row.username}
                </div>
            )
        }
    },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'role', headerName: 'Role', width: 150 },
]

export const tourColumns = [
    { field: '_id', headerName: 'ID', width: 120 },
    {
        field: 'title', headerName: 'Title', width: 300,
        renderCell: (params) => {
            return (
                <div className="cellWithImg">
                    <img className="cellImg" src={params.row.photo || "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-picture-coming-creative-vector-png-image_40968940.jpg"} alt="image" />
                    {params.row.title}
                </div>
            )
        }
    },
    { field: 'city', headerName: 'City', width: 150 },
    { field: 'address', headerName: 'Address', width: 200 },
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

export const postColumns = [
    { field: '_id', headerName: 'ID', width: 150 },
    {
        field: 'title', headerName: 'Title', width: 300,
        renderCell: (params) => {
            return (
                <div className="cellWithImg">
                    <img className="cellImg" src={params.row.photo || "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-picture-coming-creative-vector-png-image_40968940.jpg"} alt="blog" />
                    {params.row.title}
                </div>
            );
        }
    },
    { field: 'author', headerName: 'Author', width: 150 },
    // { field: 'likeCount', headerName: 'Likes', width: 120, type: 'number' },
    {
        field: 'createdAt',
        headerName: 'Created At',
        width: 180,
        renderCell: (params) => params.value ? format(new Date(params.value), "dd/MM/yyyy") : "N/A"
    },
    {
        field: 'updatedAt',
        headerName: 'Updated At',
        width: 180,
        renderCell: (params) => params.value ? format(new Date(params.value), "dd/MM/yyyy") : "N/A"
    }
]


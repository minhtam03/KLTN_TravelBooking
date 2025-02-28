import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { useState, useEffect } from "react";
import { BASE_URL } from "../../../utils/config";

const BookingTable = () => {
    const rows = [
        {
            id: 1143155,
            product: "Tour 1",
            img: "https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_UY327_FMwebp_QL65_.jpg",
            customer: "John Smith",
            date: "1 March",
            amount: 785,
            method: "Cash on Delivery",
            status: "Approved",
        },
        {
            id: 2235235,
            product: "Tour 2",
            img: "https://m.media-amazon.com/images/I/31JaiPXYI8L._AC_UY327_FMwebp_QL65_.jpg",
            customer: "Michael Doe",
            date: "1 March",
            amount: 900,
            method: "Online Payment",
            status: "Pending",
        },
        {
            id: 2342353,
            product: "Tour 3",
            img: "https://m.media-amazon.com/images/I/71kr3WAj1FL._AC_UY327_FMwebp_QL65_.jpg",
            customer: "John Smith",
            date: "1 March",
            amount: 35,
            method: "Cash on Delivery",
            status: "Pending",
        },
        {
            id: 2357741,
            product: "Tour 1",
            img: "https://m.media-amazon.com/images/I/71wF7YDIQkL._AC_UY327_FMwebp_QL65_.jpg",
            customer: "Jane Smith",
            date: "1 March",
            amount: 920,
            method: "Online",
            status: "Approved",
        },
        {
            id: 2342355,
            product: "Tour 1",
            img: "https://m.media-amazon.com/images/I/81hH5vK-MCL._AC_UY327_FMwebp_QL65_.jpg",
            customer: "Harold Carol",
            date: "1 March",
            amount: 2000,
            method: "Online",
            status: "Pending",
        },
    ];

    const [bookings, setBookings] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Hàm xử lý số dòng trên mỗi trang (nếu muốn thay đổi)
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 11));
        setPage(0); // Reset về trang đầu khi thay đổi số dòng trên mỗi trang
    };
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch(`${BASE_URL}/booking/bookings-with-amount`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch bookings");
                }

                const result = await res.json();
                setBookings(result.data); // Đảm bảo API trả về đúng định dạng
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };

        fetchBookings();
    }, []);

    return (
        <TableContainer component={Paper} className="table">
            <Table sx={{ minWidth: 650 }} aria-label="booking table">
                <TableHead>
                    <TableRow>
                        <TableCell className="tableCell">No.</TableCell>
                        {/* <TableCell className="tableCell">Booking ID</TableCell> */}
                        <TableCell className="tableCell">Tour Name</TableCell>
                        <TableCell className="tableCell">Customer Name</TableCell>
                        <TableCell className="tableCell">Guest Size</TableCell>
                        <TableCell className="tableCell">Phone</TableCell>
                        <TableCell className="tableCell">Booking Date</TableCell>

                        <TableCell className="tableCell">Amount</TableCell>
                        <TableCell className="tableCell">Payment Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bookings
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Phân trang
                        .map((booking, index) => (
                            <TableRow key={booking._id}>
                                <TableCell className="tableCell">
                                    {page * rowsPerPage + index + 1}
                                </TableCell>
                                {/* <TableCell className="tableCell">{booking._id}</TableCell> */}
                                <TableCell className="tableCell">{booking.tourName}</TableCell>
                                <TableCell className="tableCell">{booking.fullName}</TableCell>
                                <TableCell className="tableCell">{booking.guestSize}</TableCell>
                                <TableCell className="tableCell">{booking.phone}</TableCell>
                                <TableCell className="tableCell">
                                    {new Date(booking.bookAt).toLocaleDateString()}
                                </TableCell>

                                <TableCell className="tableCell">
                                    {booking.amount ? `$${booking.amount}` : "N/A"} {/* Hiển thị amount */}
                                </TableCell>
                                <TableCell className="tableCell">
                                    <span className={`status ${booking.paymentStatus}`}>
                                        {booking.paymentStatus}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[11]} // Chỉ cho phép hiển thị 9 dòng mỗi trang
                component="div"
                count={bookings.length} // Tổng số booking
                rowsPerPage={rowsPerPage} // Hiển thị 11 dòng mỗi trang
                page={page} // Trang hiện tại
                onPageChange={handleChangePage} // Khi chuyển trang
                onRowsPerPageChange={handleChangeRowsPerPage} // Khi đổi số dòng mỗi trang
            />
        </TableContainer>
    );
};

export default BookingTable;

// import "./table.scss";
// import { useState, useEffect } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { BASE_URL } from "../../../utils/config";

// const List = () => {
//     const [bookings, setBookings] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchBookings = async () => {
//             try {
//                 const res = await fetch(`${BASE_URL}/booking/`, {
//                     method: "GET",
//                     credentials: "include",
//                 });

//                 if (!res.ok) {
//                     throw new Error("Failed to fetch bookings");
//                 }

//                 const result = await res.json();
//                 setBookings(result.data || []);
//             } catch (error) {
//                 console.error("Error fetching bookings:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchBookings();
//     }, []);

//     const columns = [
//         { field: "stt", headerName: "STT", width: 80 }, // Cột số thứ tự
//         { field: "_id", headerName: "Booking ID", width: 200 },
//         { field: "tourName", headerName: "Tour Name", width: 200 },
//         { field: "fullName", headerName: "Customer Name", width: 180 },
//         { field: "guestSize", headerName: "Guest Size", width: 150, type: "number" },
//         { field: "phone", headerName: "Phone", width: 150 },
//         {
//             field: "bookAt",
//             headerName: "Booking Date",
//             width: 180,
//             type: "date",
//             valueGetter: (params) => {
//                 try {
//                     const dateValue = params?.row?.bookAt ? new Date(params.row.bookAt) : null;
//                     return dateValue && !isNaN(dateValue.getTime()) ? dateValue : null;
//                 } catch (error) {
//                     console.error("Error parsing date:", error);
//                     return null;
//                 }
//             }
//         },
//         {
//             field: "paymentStatus",
//             headerName: "Payment Status",
//             width: 180,
//             // renderCell: (params) => {
//             //     let color = "gray";
//             //     if (params.value === "paid") color = "green";
//             //     else if (params.value === "pending") color = "goldenrod";
//             //     else if (params.value === "failed") color = "red";

//             //     return (
//             //         <span style={{ color, fontWeight: "bold" }}>
//             //             {params.value.toUpperCase()}
//             //         </span>
//             //     );
//             // }
//         }
//     ];

//     // Thêm STT vào dữ liệu
//     const rows = bookings.map((booking, index) => ({
//         ...booking,
//         stt: index + 1, // STT bắt đầu từ 1
//     }));

//     return (
//         <div className="datatable">
//             {!loading && bookings.length > 0 ? (
//                 <DataGrid
//                     className="datagrid"
//                     rows={rows}
//                     columns={columns}
//                     getRowId={(row) => row._id}
//                     pageSize={8}
//                     rowsPerPageOptions={[8]}
//                     checkboxSelection
//                     disableRowSelectionOnClick
//                 />
//             ) : (
//                 <p>Loading...</p>
//             )}
//         </div>
//     );
// };

// export default List;


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

const BookingTable = ({ userId, tourId }) => {

    const [bookings, setBookings] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [loading, setLoading] = useState(true);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 11));
        setPage(0);
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

                let filteredBookings = result.data;

                // Nếu có userId, lọc danh sách theo userId
                if (userId) {
                    filteredBookings = filteredBookings.filter(booking => booking.userId === userId);
                }

                if (tourId) {
                    filteredBookings = filteredBookings.filter(booking => booking.tourId === tourId);
                }

                // console.log(filteredBookings)

                setBookings(filteredBookings);

            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
            finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [userId, tourId]);

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
                        <TableCell className="tableCell">Tour Date</TableCell>
                        <TableCell className="tableCell">Booking Date</TableCell>
                        <TableCell className="tableCell">Amount</TableCell>
                        <TableCell className="tableCell">Payment Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={8} align="center">
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : bookings.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} align="center">
                                No bookings available
                            </TableCell>
                        </TableRow>
                    ) : (
                        bookings
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((booking, index) => (
                                <TableRow key={booking._id}>
                                    <TableCell className="tableCell">
                                        {page * rowsPerPage + index + 1}
                                    </TableCell>
                                    <TableCell className="tableCell">{booking.tourName}</TableCell>
                                    <TableCell className="tableCell">{booking.fullName}</TableCell>
                                    <TableCell className="tableCell">{booking.guestSize}</TableCell>
                                    <TableCell className="tableCell">{booking.phone}</TableCell>
                                    <TableCell className="tableCell">
                                        {new Date(booking.bookAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="tableCell">
                                        {new Date(booking.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="tableCell">
                                        {booking.amount ? `$${booking.amount}` : "N/A"}
                                    </TableCell>
                                    <TableCell className="tableCell">
                                        <span className={`status ${booking.paymentStatus}`}>
                                            {booking.paymentStatus}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                    )}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[11]}
                component="div"
                count={bookings.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </TableContainer>
    );
};

export default BookingTable;

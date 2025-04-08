// import "./table.scss";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import TablePagination from "@mui/material/TablePagination";
// import { useState, useEffect } from "react";
// import { BASE_URL } from "../../../utils/config";

// const BookingTable = ({ userId, tourId, hotelId }) => {

//     const [bookings, setBookings] = useState([]);
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(8);
//     const [loading, setLoading] = useState(true);

//     const type = tourId ? "tour" : hotelId ? "hotel" : null;

//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     };

//     useEffect(() => {
//         const fetchBookings = async () => {
//             try {
//                 let endpoint = "";

//                 if (type === "tour") {
//                     endpoint = `${BASE_URL}/booking/tour/bookings-with-amount`;
//                 } else if (type === "hotel") {
//                     endpoint = `${BASE_URL}/booking/hotel/bookings-with-amount`;
//                 } else {
//                     return;
//                 }

//                 const res = await fetch(endpoint, {
//                     method: "GET",
//                     credentials: "include",
//                 });

//                 if (!res.ok) throw new Error("Failed to fetch bookings");

//                 const result = await res.json();
//                 let filtered = result.data;

//                 if (userId) filtered = filtered.filter(b => b.userId === userId);
//                 if (tourId) filtered = filtered.filter(b => b.tourId === tourId);
//                 if (hotelId) filtered = filtered.filter(b => b.hotelId === hotelId);

//                 setBookings(filtered);
//             } catch (error) {
//                 console.error("Error fetching bookings:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchBookings();
//     }, [userId, tourId, hotelId, type]);

//     return (
//         <TableContainer component={Paper} className="table">
//             <Table sx={{ minWidth: 650 }} aria-label="booking table">
//                 <TableHead>
//                     <TableRow>
//                         <TableCell className="tableCell">No.</TableCell>
//                         <TableCell className="tableCell">{type === "tour" ? "Tour Name" : "Hotel Name"}</TableCell>
//                         <TableCell className="tableCell">Customer Name</TableCell>
//                         <TableCell className="tableCell">{type === "tour" ? "Guest Size" : "Nights"}</TableCell>
//                         <TableCell className="tableCell">Phone</TableCell>
//                         <TableCell className="tableCell">{type === "tour" ? "Tour Date" : "Check-in Date"}</TableCell>
//                         <TableCell className="tableCell">Booking Date</TableCell>
//                         <TableCell className="tableCell">Amount</TableCell>
//                         <TableCell className="tableCell">Payment Status</TableCell>
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {loading ? (
//                         <TableRow>
//                             <TableCell colSpan={9} align="center">Loading...</TableCell>
//                         </TableRow>
//                     ) : bookings.length === 0 ? (
//                         <TableRow>
//                             <TableCell colSpan={9} align="center">No bookings available</TableCell>
//                         </TableRow>
//                     ) : (
//                         bookings
//                             .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                             .map((booking, index) => (
//                                 <TableRow key={booking._id}>
//                                     <TableCell>{page * rowsPerPage + index + 1}</TableCell>
//                                     <TableCell>{type === "tour" ? booking.tourName : booking.hotelName}</TableCell>
//                                     <TableCell>{booking.fullName}</TableCell>
//                                     <TableCell>{type === "tour" ? booking.guestSize : booking.nights}</TableCell>
//                                     <TableCell>{booking.phone}</TableCell>
//                                     <TableCell>{new Date(booking.bookAt).toLocaleDateString()}</TableCell>
//                                     <TableCell>{new Date(booking.createdAt).toLocaleDateString()}</TableCell>
//                                     <TableCell>{booking.amount ? `$${booking.amount}` : "N/A"}</TableCell>
//                                     <TableCell>
//                                         <span className={`status ${booking.paymentStatus}`}>
//                                             {booking.paymentStatus}
//                                         </span>
//                                     </TableCell>
//                                 </TableRow>
//                             ))
//                     )}
//                 </TableBody>
//             </Table>
//             <TablePagination
//                 rowsPerPageOptions={[11]}
//                 component="div"
//                 count={bookings.length}
//                 rowsPerPage={rowsPerPage}
//                 page={page}
//                 onPageChange={handleChangePage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//             />
//         </TableContainer>
//     );
// };

// export default BookingTable;

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

const BookingTable = ({ userId, tourId, hotelId }) => {
    const [tourBookings, setTourBookings] = useState([]);
    const [hotelBookings, setHotelBookings] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [loading, setLoading] = useState(true);

    const type = tourId ? "tour" : hotelId ? "hotel" : null;

    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            try {
                if (userId) {
                    const [resTour, resHotel] = await Promise.all([
                        fetch(`${BASE_URL}/booking/tour/bookings-with-amount`, { credentials: "include" }),
                        fetch(`${BASE_URL}/booking/hotel/bookings-with-amount`, { credentials: "include" }),
                    ]);

                    const [tourData, hotelData] = await Promise.all([resTour.json(), resHotel.json()]);

                    if (resTour.ok) {
                        setTourBookings(tourData.data.filter(b => b.userId === userId));
                    }
                    if (resHotel.ok) {
                        setHotelBookings(hotelData.data.filter(b => b.userId === userId));
                    }

                } else if (tourId || hotelId) {
                    const endpoint = `${BASE_URL}/booking/${type}/bookings-with-amount`;
                    const res = await fetch(endpoint, { credentials: "include" });
                    const result = await res.json();
                    const filtered = result.data.filter(b =>
                        type === "tour" ? b.tourId === tourId : b.hotelId === hotelId
                    );

                    type === "tour" ? setTourBookings(filtered) : setHotelBookings(filtered);
                }
                else {
                    // ✅ Trường hợp không truyền gì, load cả tour và hotel
                    const [resTour, resHotel] = await Promise.all([
                        fetch(`${BASE_URL}/booking/tour/bookings-with-amount`, { credentials: "include" }),
                        fetch(`${BASE_URL}/booking/hotel/bookings-with-amount`, { credentials: "include" }),
                    ]);

                    const [tourData, hotelData] = await Promise.all([resTour.json(), resHotel.json()]);

                    if (resTour.ok) setTourBookings(tourData.data || []);
                    if (resHotel.ok) setHotelBookings(hotelData.data || []);
                }

            } catch (err) {
                console.error("Booking fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [userId, tourId, hotelId, type]);

    const renderTable = (bookings, isTour = true) => (
        <TableContainer component={Paper} className="table" sx={{ mt: 3 }}>
            <h4 style={{ padding: "10px 16px" }}>{isTour ? "Tour Bookings" : "Hotel Bookings"}</h4>
            <Table sx={{ minWidth: 650 }} aria-label="booking table">
                <TableHead>
                    <TableRow>
                        <TableCell>No.</TableCell>
                        <TableCell>{isTour ? "Tour Name" : "Hotel Name"}</TableCell>
                        <TableCell>Customer Name</TableCell>
                        <TableCell>{isTour ? "Guest Size" : "Nights"}</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>{isTour ? "Tour Date" : "Check-in Date"}</TableCell>
                        <TableCell>Booking Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Payment Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        <TableRow><TableCell colSpan={9} align="center">Loading...</TableCell></TableRow>
                    ) : bookings.length === 0 ? (
                        <TableRow><TableCell colSpan={9} align="center">No bookings available</TableCell></TableRow>
                    ) : (
                        bookings
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((booking, index) => (
                                <TableRow key={booking._id}>
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{isTour ? booking.tourName : booking.hotelName}</TableCell>
                                    <TableCell>{booking.fullName}</TableCell>
                                    <TableCell>{isTour ? booking.guestSize : booking.nights}</TableCell>
                                    <TableCell>{booking.phone}</TableCell>
                                    <TableCell>{new Date(booking.bookAt).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(booking.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>{booking.amount ? `$${booking.amount}` : "N/A"}</TableCell>
                                    <TableCell>
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
                rowsPerPageOptions={[8, 10, 25]}
                component="div"
                count={bookings.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </TableContainer>
    );

    // return (
    //     <>
    //         {userId ? (
    //             <>
    //                 {renderTable(tourBookings, true)}
    //                 {renderTable(hotelBookings, false)}
    //             </>
    //         ) : (
    //             type === "tour"
    //                 ? renderTable(tourBookings, true)
    //                 : renderTable(hotelBookings, false)
    //         )}
    //     </>
    // );
    return (
        <>
            {userId ? (
                <>
                    {renderTable(tourBookings, true)}
                    {renderTable(hotelBookings, false)}
                </>
            ) : tourId ? (
                renderTable(tourBookings, true)
            ) : hotelId ? (
                renderTable(hotelBookings, false)
            ) : (
                <>
                    {renderTable(tourBookings, true)}
                    {renderTable(hotelBookings, false)}
                </>
            )}
        </>
    );
};

export default BookingTable;

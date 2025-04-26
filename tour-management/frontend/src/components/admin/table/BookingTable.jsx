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
import { Box, Typography, useTheme, Chip } from "@mui/material";

const BookingTable = ({ userId, tourId, hotelId, flightId }) => {
    const [tourBookings, setTourBookings] = useState([]);
    const [hotelBookings, setHotelBookings] = useState([]);
    const [flightBookings, setFlightBookings] = useState([]);
    const [tourPage, setTourPage] = useState(0);
    const [hotelPage, setHotelPage] = useState(0);
    const [flightPage, setFlightPage] = useState(0);
    const [tourRowsPerPage, setTourRowsPerPage] = useState(8);
    const [hotelRowsPerPage, setHotelRowsPerPage] = useState(8);
    const [flightRowsPerPage, setFlightRowsPerPage] = useState(8);
    const [loading, setLoading] = useState(true);

    const type = tourId ? "tour" : hotelId ? "hotel" : flightId ? "flight" : null;

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            try {
                if (userId) {
                    const [resTour, resHotel, resFlight] = await Promise.all([
                        fetch(`${BASE_URL}/booking/tour/bookings-with-amount`, { credentials: "include" }),
                        fetch(`${BASE_URL}/booking/hotel/bookings-with-amount`, { credentials: "include" }),
                        fetch(`${BASE_URL}/booking/flight/bookings-with-amount`, { credentials: "include" }),
                    ]);

                    const [tourData, hotelData, flightData] = await Promise.all([
                        resTour.json(),
                        resHotel.json(),
                        resFlight.json(),
                    ]);

                    if (resTour.ok) setTourBookings(tourData.data.filter(b => b.userId === userId));
                    if (resHotel.ok) setHotelBookings(hotelData.data.filter(b => b.userId === userId));
                    if (resFlight.ok) setFlightBookings(flightData.data.filter(b => b.userId === userId));

                } else if (tourId || hotelId || flightId) {
                    const res = await fetch(`${BASE_URL}/booking/${type}/bookings-with-amount`, { credentials: "include" });
                    const result = await res.json();

                    const filtered = result.data.filter(b =>
                        type === "tour"
                            ? b.tourId === tourId
                            : type === "hotel"
                                ? b.hotelId === hotelId
                                : b.flightId?._id === flightId
                    );

                    if (type === "tour") setTourBookings(filtered);
                    if (type === "hotel") setHotelBookings(filtered);
                    if (type === "flight") setFlightBookings(filtered);
                } else {
                    const [resTour, resHotel, resFlight] = await Promise.all([
                        fetch(`${BASE_URL}/booking/tour/bookings-with-amount`, { credentials: "include" }),
                        fetch(`${BASE_URL}/booking/hotel/bookings-with-amount`, { credentials: "include" }),
                        fetch(`${BASE_URL}/booking/flight/bookings-with-amount`, { credentials: "include" }),
                    ]);

                    const [tourData, hotelData, flightData] = await Promise.all([
                        resTour.json(),
                        resHotel.json(),
                        resFlight.json(),
                    ]);

                    if (resTour.ok) setTourBookings(tourData.data || []);
                    if (resHotel.ok) setHotelBookings(hotelData.data || []);
                    if (resFlight.ok) setFlightBookings(flightData.data || []);
                }
            } catch (err) {
                console.error("Booking fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [userId, tourId, hotelId, flightId, type]);

    const renderTable = (bookings, label, page, rowsPerPage, handleChangePage, handleChangeRowsPerPage) => (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Typography
                variant="h6"
                sx={{
                    px: 2,
                    py: 1.25,
                    bgcolor: 'rgb(201, 219, 200)',
                    border: '1px solid rgb(201, 219, 200)',
                    borderRadius: 2,
                }}
            >
                {label}
            </Typography>
            <Table sx={{ minWidth: 650 }} aria-label="booking table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>No.</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Service</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Customer Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Guests</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Booked For</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Booking Date</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Payment Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={9} align="center">
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : bookings.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} align="center">
                                No bookings available
                            </TableCell>
                        </TableRow>
                    ) : (
                        bookings
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((booking, index) => (
                                <TableRow key={booking._id}>
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>
                                        {booking.tourName || booking.hotelName || booking.flightId?.flightNumber || "N/A"}
                                    </TableCell>
                                    <TableCell>{booking.fullName}</TableCell>
                                    <TableCell>{booking.guestSize}</TableCell>
                                    <TableCell>{booking.phone}</TableCell>
                                    <TableCell>
                                        {booking.flightId?.departDate
                                            ? new Date(booking.flightId.departDate).toLocaleDateString()
                                            : new Date(booking.bookAt).toLocaleDateString()
                                        }
                                    </TableCell>
                                    <TableCell>{new Date(booking.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>{booking.amount ? `$${booking.amount}` : "N/A"}</TableCell>
                                    {/* <TableCell>
                                        <span className={`status ${booking.paymentStatus}`}>
                                            {booking.paymentStatus}
                                        </span>
                                    </TableCell> */}
                                    <TableCell>
                                        <Chip
                                            label={booking.paymentStatus}
                                            sx={{
                                                backgroundColor:
                                                    booking.paymentStatus === 'paid'
                                                        ? 'rgba(0, 128, 0, 0.151)'
                                                        : 'rgba(189, 189, 3, 0.103)',
                                                color:
                                                    booking.paymentStatus === 'paid'
                                                        ? 'green'
                                                        : 'goldenrod',
                                                borderRadius: '5px',
                                                px: 1,
                                                py: 0.5,
                                                fontWeight: 500,
                                            }}
                                        />
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

    return (
        <>
            {userId ? (
                <>
                    {renderTable(
                        tourBookings,
                        "Tour Bookings",
                        tourPage,
                        tourRowsPerPage,
                        (_, newPage) => setTourPage(newPage),
                        (e) => {
                            setTourRowsPerPage(parseInt(e.target.value, 10));
                            setTourPage(0);
                        }
                    )}
                    {renderTable(
                        hotelBookings,
                        "Hotel Bookings",
                        hotelPage,
                        hotelRowsPerPage,
                        (_, newPage) => setHotelPage(newPage),
                        (e) => {
                            setHotelRowsPerPage(parseInt(e.target.value, 10));
                            setHotelPage(0);
                        }
                    )}
                    {renderTable(
                        flightBookings,
                        "Flight Bookings",
                        flightPage,
                        flightRowsPerPage,
                        (_, newPage) => setFlightPage(newPage),
                        (e) => {
                            setFlightRowsPerPage(parseInt(e.target.value, 10));
                            setFlightPage(0);
                        }
                    )}
                </>
            ) : tourId ? (
                renderTable(
                    tourBookings,
                    "Tour Bookings",
                    tourPage,
                    tourRowsPerPage,
                    (_, newPage) => setTourPage(newPage),
                    (e) => {
                        setTourRowsPerPage(parseInt(e.target.value, 10));
                        setTourPage(0);
                    }
                )
            ) : hotelId ? (
                renderTable(
                    hotelBookings,
                    "Hotel Bookings",
                    hotelPage,
                    hotelRowsPerPage,
                    (_, newPage) => setHotelPage(newPage),
                    (e) => {
                        setHotelRowsPerPage(parseInt(e.target.value, 10));
                        setHotelPage(0);
                    }
                )
            ) : flightId ? (
                renderTable(
                    flightBookings,
                    "Flight Bookings",
                    flightPage,
                    flightRowsPerPage,
                    (_, newPage) => setFlightPage(newPage),
                    (e) => {
                        setFlightRowsPerPage(parseInt(e.target.value, 10));
                        setFlightPage(0);
                    }
                )
            ) : (
                <>
                    {renderTable(
                        tourBookings,
                        "Tour Bookings",
                        tourPage,
                        tourRowsPerPage,
                        (_, newPage) => setTourPage(newPage),
                        (e) => {
                            setTourRowsPerPage(parseInt(e.target.value, 10));
                            setTourPage(0);
                        }
                    )}
                    {renderTable(
                        hotelBookings,
                        "Hotel Bookings",
                        hotelPage,
                        hotelRowsPerPage,
                        (_, newPage) => setHotelPage(newPage),
                        (e) => {
                            setHotelRowsPerPage(parseInt(e.target.value, 10));
                            setHotelPage(0);
                        }
                    )}
                    {renderTable(
                        flightBookings,
                        "Flight Bookings",
                        flightPage,
                        flightRowsPerPage,
                        (_, newPage) => setFlightPage(newPage),
                        (e) => {
                            setFlightRowsPerPage(parseInt(e.target.value, 10));
                            setFlightPage(0);
                        }
                    )}
                </>
            )}
        </>
    );
};

export default BookingTable;

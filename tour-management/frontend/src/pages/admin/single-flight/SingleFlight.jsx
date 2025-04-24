// import React, { useState, useEffect } from 'react';
// import Sidebar from '../../../components/admin/sidebar/Sidebar';
// import Navbar from '../../../components/admin/navbar/Navbar';
// import "../single/single.scss";
// import { useParams } from 'react-router-dom';
// import { BASE_URL } from '../../../utils/config';
// import BookingTable from '../../../components/admin/table/BookingTable';
// import {
//     Grid,
//     Box,
//     Typography,
//     TextField,
//     Button,
//     Paper,
//     Divider, List,
//     ListItem,
// } from '@mui/material';
// const SingleFlight = () => {
//     const { id } = useParams();
//     const [flight, setFlight] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const [bookings, setBookings] = useState([]);

//     useEffect(() => {
//         const fetchFlight = async () => {
//             try {
//                 const res = await fetch(`${BASE_URL}/flights/${id}`, {
//                     method: "GET",
//                     credentials: "include",
//                 });

//                 if (!res.ok) throw new Error("Failed to fetch flight data");
//                 const result = await res.json();
//                 setFlight(result.data);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         const fetchFlightBookings = async () => {
//             try {
//                 const res = await fetch(`${BASE_URL}/booking/flight/bookings-with-amount`, {
//                     method: "GET",
//                     credentials: "include",
//                 });

//                 const result = await res.json();

//                 const flightBookings = result.data?.filter(b => b.flightId === id);
//                 setBookings(flightBookings || []);
//             } catch (err) {
//                 console.error("Error fetching bookings:", err);
//             }
//         };

//         fetchFlight();
//         fetchFlightBookings();
//     }, [id]);

//     return (
//         <div className="single">
//             <Sidebar />
//             <div className="singleContainer">
//                 <Navbar />
//                 <div className="top">
//                     <div className="left">
//                         <h1 className="title">Flight Information</h1>
//                         {loading ? (
//                             <p>Loading flight data...</p>
//                         ) : error ? (
//                             <p>Error: {error}</p>
//                         ) : (
//                             // <div className="item">

//                             //     <div className="details">
//                             //         <h1 className="itemTitle">{flight?.flightNumber || "Unknown"}</h1>

//                             //         <div className="detailItem"><span className="itemKey">Airline:</span><span className="itemValue">{flight?.airline}</span></div>
//                             //         <div className="detailItem"><span className="itemKey">Flight Number:</span><span className="itemValue">{flight?.flightNumber}</span></div>
//                             //         <div className="detailItem"><span className="itemKey">From:</span><span className="itemValue">{flight?.departureCity}</span></div>
//                             //         <div className="detailItem"><span className="itemKey">To:</span><span className="itemValue">{flight?.arrivalCity}</span></div>
//                             //         <div className="detailItem"><span className="itemKey">Trip Type:</span><span className="itemValue">{flight?.tripType}</span></div>
//                             //         <div className="detailItem"><span className="itemKey">Departure Date:</span><span className="itemValue">{flight?.departureDate?.slice(0, 10)}</span></div>
//                             //         <div className="detailItem"><span className="itemKey">Departure Time:</span><span className="itemValue">{flight?.departureTime}</span></div>

//                             //         {flight?.tripType === "round-trip" && (
//                             //             <>
//                             //                 <div className="detailItem"><span className="itemKey">Return Date:</span><span className="itemValue">{flight?.returnDate?.slice(0, 10) || "-"}</span></div>
//                             //                 <div className="detailItem"><span className="itemKey">Return Time:</span><span className="itemValue">{flight?.returnTime || "-"}</span></div>
//                             //             </>
//                             //         )}

//                             //         <div className="detailItem"><span className="itemKey">Class:</span><span className="itemValue">{flight?.class}</span></div>
//                             //         <div className="detailItem"><span className="itemKey">Aircraft:</span><span className="itemValue">{flight?.airplaneType}</span></div>
//                             //         <div className="detailItem"><span className="itemKey">Price:</span><span className="itemValue">{flight?.price} $</span></div>
//                             //     </div>
//                             // </div>
//                             <Grid item xs={12} md={7}>
//                                 <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, fontFamily: 'Mulish' }}>
//                                     {/* Ảnh chuyến bay */}
//                                     <Box sx={{ mb: 2 }}>
//                                         <img
//                                             src={flight.photo || 'https://www.libertytravel.com/sites/default/files/styles/full_size/public/flight-hero.jpg?itok=LKyRwKDq'} // dùng ảnh mặc định nếu không có
//                                             alt="Flight"
//                                             style={{
//                                                 width: '100%',
//                                                 height: 200,
//                                                 objectFit: 'cover',
//                                                 borderRadius: 12,
//                                             }}
//                                         />
//                                     </Box>

//                                     {/* Tiêu đề */}
//                                     {/* <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontFamily: 'Mulish' }}>
//                                         Flight Information
//                                     </Typography> */}

//                                     {/* Thông tin 2 cột */}
//                                     <Box component={Grid} container spacing={1} mt={2}>
//                                         <Grid item xs={5}>
//                                             <Typography fontWeight={600} sx={{ fontFamily: 'Mulish' }}>Flight Airline:</Typography>
//                                         </Grid>
//                                         <Grid item xs={7}>
//                                             <Typography sx={{ fontFamily: 'Mulish' }}>{flight.airline}</Typography>
//                                         </Grid>
//                                         <Grid item xs={5}>
//                                             <Typography fontWeight={600} sx={{ fontFamily: 'Mulish' }}>Flight Number:</Typography>
//                                         </Grid>
//                                         <Grid item xs={7}>
//                                             <Typography sx={{ fontFamily: 'Mulish' }}>{flight.flightNumber}</Typography>
//                                         </Grid>
//                                         <Grid item xs={5}>
//                                             <Typography fontWeight={600} sx={{ fontFamily: 'Mulish' }}>From:</Typography>
//                                         </Grid>
//                                         <Grid item xs={7}>
//                                             <Typography sx={{ fontFamily: 'Mulish' }}>{flight.departureCity}</Typography>
//                                         </Grid>

//                                         <Grid item xs={5}>
//                                             <Typography fontWeight={600} sx={{ fontFamily: 'Mulish' }}>To:</Typography>
//                                         </Grid>
//                                         <Grid item xs={7}>
//                                             <Typography sx={{ fontFamily: 'Mulish' }}>{flight.arrivalCity}</Typography>
//                                         </Grid>

//                                         <Grid item xs={5}>
//                                             <Typography fontWeight={600} sx={{ fontFamily: 'Mulish' }}>Departure:</Typography>
//                                         </Grid>
//                                         <Grid item xs={7}>
//                                             <Typography sx={{ fontFamily: 'Mulish' }}>
//                                                 {new Date(flight.departureDate).toLocaleDateString()} at {flight.departureTime}
//                                             </Typography>
//                                         </Grid>

//                                         {flight.tripType === 'round-trip' && (
//                                             <>
//                                                 <Grid item xs={5}>
//                                                     <Typography fontWeight={600} sx={{ fontFamily: 'Mulish' }}>Return:</Typography>
//                                                 </Grid>
//                                                 <Grid item xs={7}>
//                                                     <Typography sx={{ fontFamily: 'Mulish' }}>
//                                                         {new Date(flight.returnDate).toLocaleDateString()} at {flight.returnTime}
//                                                     </Typography>
//                                                 </Grid>
//                                             </>
//                                         )}

//                                         <Grid item xs={5}>
//                                             <Typography fontWeight={600} sx={{ fontFamily: 'Mulish' }}>Class:</Typography>
//                                         </Grid>
//                                         <Grid item xs={7}>
//                                             <Typography sx={{ fontFamily: 'Mulish' }}>{flight.flightClass}</Typography>
//                                         </Grid>

//                                         <Grid item xs={5}>
//                                             <Typography fontWeight={600} sx={{ fontFamily: 'Mulish' }}>Airplane:</Typography>
//                                         </Grid>
//                                         <Grid item xs={7}>
//                                             <Typography sx={{ fontFamily: 'Mulish' }}>{flight.airplaneType}</Typography>
//                                         </Grid>

//                                         <Grid item xs={5}>
//                                             <Typography fontWeight={600} sx={{ fontFamily: 'Mulish' }}>Price:</Typography>
//                                         </Grid>
//                                         <Grid item xs={7}>
//                                             <Typography sx={{ fontFamily: 'Mulish' }}>${flight.price} / person</Typography>
//                                         </Grid>
//                                     </Box>
//                                 </Paper>
//                             </Grid>

//                         )}
//                     </div>
//                 </div>

//                 {/* Booking Table */}

//                 <BookingTable flightId={id} />
//             </div>
//         </div>
//     );
// };

// export default SingleFlight;


import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, Avatar, CircularProgress, Alert } from '@mui/material';
import Sidebar from '../../../components/admin/sidebar/Sidebar';
import Navbar from '../../../components/admin/navbar/Navbar';
import Chart from '../../../components/admin/chart/Chart';
import BookingTable from '../../../components/admin/table/BookingTable';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../../utils/config';

const SingleFlight = () => {
    const { id } = useParams();
    const [flight, setFlight] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [spendingData, setSpendingData] = useState([]);

    useEffect(() => {
        const fetchFlight = async () => {
            try {
                const res = await fetch(`${BASE_URL}/flights/${id}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!res.ok) throw new Error('Failed to fetch flight data');
                const result = await res.json();
                setFlight(result.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchSpendingData = async () => {
            try {
                const res = await fetch(`${BASE_URL}/booking/flight/bookings-with-amount`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const result = await res.json();

                const flightBookings = result.data.filter(b => b.flightId?._id === id);
                const monthlySpending = {};

                flightBookings.forEach(b => {
                    const d = new Date(b.createdAt);
                    const key = `${d.getMonth() + 1}-${d.getFullYear()}`;
                    monthlySpending[key] = (monthlySpending[key] || 0) + (b.amount || 0);
                });

                const last6 = [];
                const now = new Date();
                for (let i = 5; i >= 0; i--) {
                    const m = (now.getMonth() - i + 12) % 12 + 1;
                    const y = now.getMonth() - i < 0 ? now.getFullYear() - 1 : now.getFullYear();
                    const key = `${m}-${y}`;
                    last6.push({
                        name: new Date(y, m - 1).toLocaleString('en-US', { month: 'long' }),
                        Total: monthlySpending[key] || 0,
                    });
                }
                setSpendingData(last6);
            } catch (err) {
                console.error(err);
            }
        };

        fetchFlight();
        fetchSpendingData();
    }, [id]);

    return (
        <Box display="flex">
            <Sidebar />
            <Box flex={6} p={3} sx={{ ml: "240px", flexGrow: 1 }}>
                <Navbar />
                <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3} mt={3}>
                    <Box flex={1} display="flex" flexDirection="column" justifyContent="stretch">
                        {loading ? (
                            <CircularProgress />
                        ) : error ? (
                            <Alert severity="error">Error: {error}</Alert>
                        ) : (
                            <Card sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                                <Typography variant="h5" fontWeight={700} mb={2}>Flight Information</Typography>
                                <Box display="flex" gap={3} alignItems="center" mb={3}>
                                    <Avatar
                                        variant="circular"
                                        src={flight?.photo || 'https://www.libertytravel.com/sites/default/files/styles/full_size/public/flight-hero.jpg?itok=LKyRwKDq'}
                                        sx={{ width: 64, height: 64 }}
                                    />
                                    <Box display="grid" gridTemplateColumns="auto 1fr" rowGap={1} columnGap={2}>
                                        <Typography variant="body2" fontWeight={600}>Airline:</Typography>
                                        <Typography variant="body2">{flight?.airline || 'N/A'}</Typography>

                                        <Typography variant="body2" fontWeight={600}>Flight No:</Typography>
                                        <Typography variant="body2">{flight?.flightNumber || 'N/A'}</Typography>

                                        <Typography variant="body2" fontWeight={600}>From:</Typography>
                                        <Typography variant="body2">{flight?.departureCity || 'N/A'}</Typography>

                                        <Typography variant="body2" fontWeight={600}>To:</Typography>
                                        <Typography variant="body2">{flight?.arrivalCity || 'N/A'}</Typography>

                                        <Typography variant="body2" fontWeight={600}>Departure:</Typography>
                                        <Typography variant="body2">{flight?.departureDate?.slice(0, 10)} at {flight?.departureTime}</Typography>

                                        {flight?.tripType === 'round-trip' && (
                                            <>
                                                <Typography variant="body2" fontWeight={600}>Return:</Typography>
                                                <Typography variant="body2">{flight?.returnDate?.slice(0, 10)} at {flight?.returnTime}</Typography>
                                            </>
                                        )}

                                        <Typography variant="body2" fontWeight={600}>Class:</Typography>
                                        <Typography variant="body2">{flight?.flightClass || 'N/A'}</Typography>

                                        <Typography variant="body2" fontWeight={600}>Aircraft:</Typography>
                                        <Typography variant="body2">{flight?.airplaneType || 'N/A'}</Typography>

                                        <Typography variant="body2" fontWeight={600}>Price:</Typography>
                                        <Typography variant="body2">${flight?.price || 'N/A'}</Typography>
                                    </Box>
                                </Box>
                            </Card>
                        )}
                    </Box>
                    <Box flex={2} display="flex" flexDirection="column" justifyContent="stretch">
                        <Card sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                            <Chart aspect={3 / 1} title="Flight Revenue (Last 6 Months)" data={spendingData} />
                        </Card>
                    </Box>
                </Box>
                <Box mt={5}>
                    <Typography variant="h5" fontWeight={700} mb={2}>Flight Transactions</Typography>
                    <BookingTable flightId={id} />
                </Box>
            </Box>
        </Box>
    );
};

export default SingleFlight;


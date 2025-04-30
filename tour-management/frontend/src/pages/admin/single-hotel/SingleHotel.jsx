// import React, { useState, useEffect } from 'react';
// import Sidebar from '../../../components/admin/sidebar/Sidebar';
// import Navbar from '../../../components/admin/navbar/Navbar';
// import Chart from '../../../components/admin/chart/Chart';
// import BookingTable from '../../../components/admin/table/BookingTable';
// import "../single/single.scss";
// import { useParams } from 'react-router-dom';
// import { BASE_URL } from '../../../utils/config';

// const SingleHotel = () => {
//     const { id } = useParams();
//     const [hotel, setHotel] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [spendingData, setSpendingData] = useState([]);

//     useEffect(() => {
//         const fetchHotel = async () => {
//             try {
//                 const res = await fetch(`${BASE_URL}/hotels/${id}`, {
//                     method: "GET",
//                     credentials: "include",
//                 });

//                 if (!res.ok) throw new Error("Failed to fetch hotel data");
//                 const result = await res.json();
//                 setHotel(result.data);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         const fetchSpendingData = async () => {
//             try {
//                 const res = await fetch(`${BASE_URL}/booking/hotel/bookings-with-amount`, {
//                     method: "GET",
//                     credentials: "include",
//                 });

//                 if (!res.ok) throw new Error("Failed to fetch hotel bookings");
//                 const result = await res.json();

//                 const hotelBookings = result.data.filter(booking => booking.hotelId === id);

//                 const monthlySpending = {};

//                 hotelBookings.forEach(booking => {
//                     const date = new Date(booking.createdAt);
//                     const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

//                     if (!monthlySpending[monthYear]) {
//                         monthlySpending[monthYear] = 0;
//                     }

//                     monthlySpending[monthYear] += booking.amount || 0;
//                 });

//                 const last6Months = [];
//                 const currentDate = new Date();
//                 for (let i = 5; i >= 0; i--) {
//                     const month = currentDate.getMonth() + 1 - i;
//                     const year = currentDate.getFullYear();
//                     const key = `${month}-${year}`;

//                     last6Months.push({
//                         name: new Date(year, month - 1).toLocaleString('en-US', { month: 'long' }),
//                         Total: monthlySpending[key] || 0,
//                     });
//                 }

//                 setSpendingData(last6Months);
//             } catch (err) {
//                 console.error(err);
//             }
//         };

//         fetchHotel();
//         fetchSpendingData();
//     }, [id]);

//     return (
//         <div className="single">
//             <Sidebar />
//             <div className="singleContainer">
//                 <Navbar />
//                 <div className="top">
//                     <div className="left">
//                         <h1 className="title">Hotel Information</h1>
//                         {loading ? (
//                             <p>Loading hotel data...</p>
//                         ) : error ? (
//                             <p>Error: {error}</p>
//                         ) : (
//                             <div className="item">
//                                 <img
//                                     src={hotel?.photo || "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}
//                                     alt="Hotel"
//                                     className="itemImg"
//                                 />
//                                 <div className="details">
//                                     <h1 className="itemTitle">{hotel?.hotelName || "Unknown"}</h1>

//                                     <div className="detailItem">
//                                         <span className="itemKey">Hotel Name:</span>
//                                         <span className="itemValue">{hotel?.hotelName || "N/A"}</span>
//                                     </div>

//                                     <div className="detailItem">
//                                         <span className="itemKey">City:</span>
//                                         <span className="itemValue">{hotel?.location || "N/A"}</span>
//                                     </div>

//                                     <div className="detailItem">
//                                         <span className="itemKey">Star:</span>
//                                         <span className="itemValue">{hotel?.stars || "N/A"}</span>
//                                     </div>

//                                     <div className="detailItem">
//                                         <span className="itemKey">Amenities:</span>
//                                         <span className="itemValue">{hotel?.amenities || "N/A"}</span>
//                                     </div>

//                                     <div className="detailItem">
//                                         <span className="itemKey">Price per Night:</span>
//                                         <span className="itemValue">{hotel?.pricePerNight || "N/A"} $</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                     <div className="right">
//                         <Chart aspect={3 / 1} title="Hotel Revenue (Last 6 Months)" data={spendingData} />
//                     </div>
//                 </div>

//                 <div className="bottom">
//                     <h1 className="title">Hotel Transactions</h1>
//                     <BookingTable hotelId={id} />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SingleHotel;


import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, Avatar, CircularProgress, Alert } from '@mui/material';
import Sidebar from '../../../components/admin/sidebar/Sidebar';
import Navbar from '../../../components/admin/navbar/Navbar';
import Chart from '../../../components/admin/chart/Chart';
import BookingTable from '../../../components/admin/table/BookingTable';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../../utils/config';

const SingleHotel = () => {
    const { id } = useParams();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [spendingData, setSpendingData] = useState([]);

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const res = await fetch(`${BASE_URL}/hotels/${id}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!res.ok) throw new Error('Failed to fetch hotel data');
                const result = await res.json();
                setHotel(result.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchSpendingData = async () => {
            try {
                const res = await fetch(`${BASE_URL}/booking/hotel/bookings-with-amount`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const result = await res.json();
                const hotelBookings = result.data.filter(b => b.hotelId === id);
                const monthlySpending = {};

                hotelBookings.forEach(b => {
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

        fetchHotel();
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
                                <Typography variant="h5" fontWeight={700} mb={2}>Hotel Information</Typography>
                                <Box display="flex" gap={3} alignItems="center" mb={3}>
                                    <Avatar
                                        variant="circular"
                                        src={hotel?.photo || 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'}
                                        sx={{ width: 64, height: 64 }}
                                    />
                                    <Box display="grid" gridTemplateColumns="auto 1fr" rowGap={1} columnGap={2}>
                                        <Typography variant="body1" fontWeight={600}>Name:</Typography>
                                        <Typography variant="body1">{hotel?.hotelName || 'N/A'}</Typography>

                                        <Typography variant="body1" fontWeight={600}>City:</Typography>
                                        <Typography variant="body1">{hotel?.location || 'N/A'}</Typography>

                                        <Typography variant="body1" fontWeight={600}>Stars:</Typography>
                                        <Typography variant="body1">{hotel?.stars || 'N/A'}</Typography>

                                        <Typography variant="body1" fontWeight={600}>Amenities:</Typography>
                                        <Typography variant="body1">
                                            {hotel?.amenities?.length > 0 ? hotel.amenities.join(', ') : 'N/A'}
                                        </Typography>
                                        <Typography variant="body1" fontWeight={600}>Price/Night:</Typography>
                                        <Typography variant="body1">{hotel?.pricePerNight || 'N/A'} $</Typography>
                                    </Box>
                                </Box>
                            </Card>
                        )}
                    </Box>
                    <Box flex={2} display="flex" flexDirection="column" justifyContent="stretch">
                        <Card sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                            <Chart aspect={3 / 1} title="Hotel Revenue (Last 6 Months)" data={spendingData} />
                        </Card>
                    </Box>
                </Box>
                <Box mt={5}>
                    <Typography variant="h5" fontWeight={700} mb={2}>Hotel Transactions</Typography>
                    <BookingTable hotelId={id} />
                </Box>
            </Box>
        </Box>
    );
};

export default SingleHotel;


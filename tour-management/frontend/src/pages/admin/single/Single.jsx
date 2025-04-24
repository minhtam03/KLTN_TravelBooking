// import React, { useState, useEffect } from 'react'
// import Sidebar from '../../../components/admin/sidebar/Sidebar'
// import Navbar from '../../../components/admin/navbar/Navbar'
// import Chart from '../../../components/admin/chart/Chart'
// import BookingTable from '../../../components/admin/table/BookingTable'
// import "./single.scss"
// import { useParams } from 'react-router-dom'
// import { BASE_URL } from '../../../utils/config'

// const Single = () => {

//     const { id } = useParams()
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [spendingData, setSpendingData] = useState([]);

//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const res = await fetch(`${BASE_URL}/users/${id}`, {
//                     method: "GET",
//                     credentials: "include",
//                 });

//                 if (!res.ok) {
//                     throw new Error("Failed to fetch user data");
//                 }

//                 const result = await res.json();
//                 setUser(result.data);
//                 setLoading(false);
//             } catch (error) {
//                 setError(error.message);
//                 setLoading(false);
//             }
//         };

//         const fetchSpendingData = async () => {
//             try {
//                 const endpoints = [
//                     `${BASE_URL}/booking/tour/bookings-with-amount`,
//                     `${BASE_URL}/booking/hotel/bookings-with-amount`
//                 ];

//                 const responses = await Promise.all(endpoints.map(url =>
//                     fetch(url, { method: "GET", credentials: "include" })
//                 ));

//                 const allResults = await Promise.all(responses.map(res => res.json()));

//                 let allBookings = [];
//                 for (const result of allResults) {
//                     if (result.success) {
//                         const userBookings = result.data.filter(b => b.userId === id);
//                         allBookings = allBookings.concat(userBookings);
//                     }
//                 }

//                 const monthlySpending = {};

//                 allBookings.forEach(booking => {
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
//                     const month = (currentDate.getMonth() - i + 12) % 12 + 1;
//                     const year = currentDate.getMonth() - i < 0
//                         ? currentDate.getFullYear() - 1
//                         : currentDate.getFullYear();
//                     const key = `${month}-${year}`;

//                     last6Months.push({
//                         name: new Date(year, month - 1).toLocaleString('en-US', { month: 'long' }),
//                         Total: monthlySpending[key] || 0,
//                     });
//                 }

//                 setSpendingData(last6Months);
//             } catch (error) {
//                 console.error('Error fetching spending data:', error);
//             }
//         };
//         fetchUser();
//         fetchSpendingData();
//     }, [id]);

//     return (
//         <div className="single">
//             <Sidebar />
//             <div className="singleContainer">
//                 <Navbar />
//                 <div className="top">
//                     <div className="left">
//                         {/* <div className="editButton">Edit</div> */}
//                         <h1 className="title">Information</h1>

//                         {loading ? (
//                             <p>Loading user data...</p>
//                         ) : error ? (
//                             <p>Error: {error}</p>
//                         ) : (
//                             <div className="item">
//                                 <img
//                                     src={user?.photo || "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}
//                                     alt="User Profile"
//                                     className="itemImg"
//                                 />
//                                 {/* <img
//                                     src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
//                                     alt=""
//                                     className="itemImg"
//                                 /> */}
//                                 <div className="details">
//                                     <h1 className="itemTitle">{user?.username || "Unknown"}</h1>

//                                     <div className="detailItem">
//                                         <span className="itemKey">Username:</span>
//                                         <span className="itemValue">{user?.username || "N/A"}</span>
//                                     </div>
//                                     <div className="detailItem">
//                                         <span className="itemKey">Email:</span>
//                                         <span className="itemValue">{user?.email || "N/A"}</span>
//                                     </div>
//                                     <div className="detailItem">
//                                         <span className="itemKey">Phone:</span>
//                                         <span className="itemValue">{user?.phone || "N/A"}</span>
//                                     </div>
//                                     <div className="detailItem">
//                                         <span className="itemKey">Address:</span>
//                                         <span className="itemValue">{user?.address || "N/A"}</span>
//                                     </div>
//                                     <div className="detailItem">
//                                         <span className="itemKey">Photo:</span>
//                                         <span className="itemValue">{user?.photo || "N/A"}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                     <div className="right">
//                         <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" data={spendingData} />
//                     </div>
//                 </div>
//                 <div className="bottom">
//                     <h1 className="title">User Transactions</h1>
//                     <BookingTable userId={id} />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Single;
import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, Avatar, CircularProgress, Alert } from '@mui/material';
import Sidebar from '../../../components/admin/sidebar/Sidebar';
import Navbar from '../../../components/admin/navbar/Navbar';
import Chart from '../../../components/admin/chart/Chart';
import BookingTable from '../../../components/admin/table/BookingTable';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../../utils/config';

const Single = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [spendingData, setSpendingData] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${BASE_URL}/users/${id}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!res.ok) throw new Error('Failed to fetch user data');

                const result = await res.json();
                setUser(result.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        const fetchSpendingData = async () => {
            try {
                const endpoints = [
                    `${BASE_URL}/booking/tour/bookings-with-amount`,
                    `${BASE_URL}/booking/hotel/bookings-with-amount`
                ];

                const responses = await Promise.all(endpoints.map(url =>
                    fetch(url, { method: 'GET', credentials: 'include' })
                ));

                const allResults = await Promise.all(responses.map(res => res.json()));
                let allBookings = [];
                for (const result of allResults) {
                    if (result.success) {
                        const userBookings = result.data.filter(b => b.userId === id);
                        allBookings = allBookings.concat(userBookings);
                    }
                }

                const monthlySpending = {};
                allBookings.forEach(booking => {
                    const date = new Date(booking.createdAt);
                    const key = `${date.getMonth() + 1}-${date.getFullYear()}`;
                    monthlySpending[key] = (monthlySpending[key] || 0) + (booking.amount || 0);
                });

                const last6Months = [];
                const currentDate = new Date();

                for (let i = 5; i >= 0; i--) {
                    const month = (currentDate.getMonth() - i + 12) % 12 + 1;
                    const year = currentDate.getMonth() - i < 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
                    const key = `${month}-${year}`;

                    last6Months.push({
                        name: new Date(year, month - 1).toLocaleString('en-US', { month: 'long' }),
                        Total: monthlySpending[key] || 0,
                    });
                }

                setSpendingData(last6Months);
            } catch (error) {
                console.error('Error fetching spending data:', error);
            }
        };

        fetchUser();
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
                                <Typography variant="h5" fontWeight={700} mb={2}>Information</Typography>
                                <Box display="flex" gap={3} alignItems="center" mb={3}>
                                    <Avatar
                                        variant="circular"
                                        src={user?.photo || 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'}
                                        sx={{ width: 64, height: 64 }}
                                    />
                                    <Box display="grid" gridTemplateColumns="auto 1fr" rowGap={1} columnGap={2}>
                                        <Typography variant="body1" fontWeight={600}>Username:</Typography>
                                        <Typography variant="body1" >{user?.username || 'N/A'}</Typography>

                                        <Typography variant="body1" fontWeight={600}>Email:</Typography>
                                        <Typography variant="body1" >{user?.email || 'N/A'}</Typography>

                                        <Typography variant="body1" fontWeight={600}>Phone:</Typography>
                                        <Typography variant="body1">{user?.phone || 'N/A'}</Typography>

                                        <Typography variant="body1" fontWeight={600}>Address:</Typography>
                                        <Typography variant="body1" >{user?.address || 'N/A'}</Typography>

                                        {/* <Typography variant="body2" fontWeight={600}>Photo:</Typography>
                                        <Typography variant="body2" color="text.secondary">{user?.photo || 'N/A'}</Typography> */}
                                    </Box>
                                </Box>
                            </Card>
                        )}
                    </Box>

                    <Box flex={2} display="flex" flexDirection="column" justifyContent="stretch" height="100%">
                        <Card sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                            <Chart aspect={3 / 1} title="User Spending (Last 6 Months)" data={spendingData} />
                        </Card>
                    </Box>
                </Box>

                <Box mt={5}>
                    <Typography variant="h5" fontWeight={700} mb={2}>User Transactions</Typography>
                    <BookingTable userId={id} />
                </Box>
            </Box>
        </Box>
    );
};

export default Single;

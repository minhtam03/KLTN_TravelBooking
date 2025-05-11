import React, { useEffect, useContext, useState } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Alert, AlertTitle, Box, Button } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../utils/config';
import CommonSection from '../shared/CommonSection';
import BookingCard from '../shared/BookingCard'; // xử lý theo type bên trong
import axios from 'axios';

const GenericBookingHistory = ({ type, title }) => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/booking/${type}/count`, {
                    withCredentials: true,
                });
                setPageCount(Math.ceil(res.data.count / 8));
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch count");
            }
        };
        if (user) fetchCount();
    }, [user, type]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/booking/${type}/all?page=${page}`, {
                    withCredentials: true,
                });
                setBookings(res.data.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch bookings");
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [user, type, page]);

    // return (
    //     <>
    //         <CommonSection title={title} />
    //         <Container>
    //             {loading && <p className="text-center pt-5">Loading...</p>}
    //             {error && <p className="text-center pt-5 text-danger">{error}</p>}
    //             {!loading && bookings.length === 0 && !error && (
    //                 <p className="text-center pt-5">No bookings found.</p>
    //             )}
    //             <Row>
    //                 {bookings.map((booking) => (
    //                     <Col lg="3" md="6" sm="12" key={booking._id} className="mb-4">
    //                         <BookingCard booking={booking} type={type} />
    //                     </Col>
    //                 ))}
    //             </Row>
    //             <Row>
    //                 <Col lg="12">
    //                     <div className="pagination d-flex align-items-center justify-content-center mt-4 gap-3">
    //                         {[...Array(pageCount).keys()].map((number) => (
    //                             <span
    //                                 key={number}
    //                                 onClick={() => setPage(number)}
    //                                 className={page === number ? "active__page" : ""}
    //                             >
    //                                 {number + 1}
    //                             </span>
    //                         ))}
    //                     </div>
    //                 </Col>
    //             </Row>

    //         </Container>
    //     </>
    // );

    return (
        <>
            <CommonSection title={title} />
            <Container>
                {!user ? (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        minHeight="40vh"
                    >
                        <Alert
                            severity="warning"
                            sx={{
                                maxWidth: 500,
                                textAlign: 'center',
                                backgroundColor: '#fff',
                                // boxShadow: 2,
                                border: 'none',
                                borderRadius: 2,
                                px: 3,
                                py: 2,
                                '& .MuiAlert-icon': {
                                    mr: 1, // giảm khoảng cách từ icon đến text (mặc định là 12px ~ 1.5)
                                },
                            }}
                        >
                            <AlertTitle><strong>Sign In Required</strong></AlertTitle>
                            You must be signed in to view your booking history.

                        </Alert>
                    </Box>
                ) : (
                    <>
                        {loading && <p className="text-center pt-5">Loading...</p>}
                        {error && <p className="text-center pt-5 text-danger">{error}</p>}
                        {!loading && bookings.length === 0 && !error && (
                            <Box display="flex" justifyContent="center" alignItems="center" minHeight="30vh">
                                <Alert
                                    severity="info"
                                    sx={{
                                        maxWidth: 500,
                                        textAlign: 'center',
                                        backgroundColor: '#fff',
                                        border: 'none',
                                        borderRadius: 2,
                                        px: 3,
                                        py: 2,
                                        '& .MuiAlert-icon': {
                                            mr: 1,
                                        },
                                    }}
                                >
                                    <AlertTitle><strong>No Bookings Found</strong></AlertTitle>
                                    You have no booking history to display.
                                </Alert>
                            </Box>
                        )}
                        <Row>
                            {bookings.map((booking) => (
                                <Col lg="3" md="6" sm="12" key={booking._id} className="mb-4">
                                    <BookingCard booking={booking} type={type} />
                                </Col>
                            ))}
                        </Row>
                        <Row>
                            <Col lg="12">
                                <div className="pagination d-flex align-items-center justify-content-center mt-4 gap-3">
                                    {[...Array(pageCount).keys()].map((number) => (
                                        <span
                                            key={number}
                                            onClick={() => setPage(number)}
                                            className={page === number ? "active__page" : ""}
                                        >
                                            {number + 1}
                                        </span>
                                    ))}
                                </div>
                            </Col>
                        </Row>
                    </>
                )}
            </Container>
        </>
    );

};

export default GenericBookingHistory;

import React, { useContext, useEffect, useRef, useState, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import {
    Typography, Box, List,
    ListItem, ListItemText,
    ListItemAvatar, TextField, Button, Avatar, Container, Pagination
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import calculateAvgRating from '../utils/avgRating';
import { BASE_URL } from '../utils/config';
import BookingForm from '../components/Booking/BookingForm';
import FmdGoodRoundedIcon from '@mui/icons-material/FmdGoodRounded';
import StarIcon from '@mui/icons-material/Star';

const extractSummarySections = (raw) => {
    const cleaned = raw.replace(/\*/g, '').trim();
    const positive = cleaned.match(/Positive Aspects:\s*(.*?)(?=Negative Aspects:|$)/s)?.[1]?.trim();
    const negative = cleaned.match(/Negative Aspects:\s*(.*?)(?=General User Impressions:|$)/s)?.[1]?.trim();
    const impression = cleaned.match(/General User Impressions:\s*(.*?)(?=$)/s)?.[1]?.trim();
    return { positive, negative, impression };
};

const RatingStars = ({ current, onRate }) => (
    <Box display="flex" alignItems="center" gap={2} mb={3}>
        {[1, 2, 3, 4, 5].map((star) => (
            <Box
                key={star}
                onClick={() => onRate(star)}
                sx={{ display: 'flex', alignItems: 'center', fontSize: '1.1rem', color: 'var(--secondary-color)', cursor: 'pointer' }}
            >
                <Typography sx={{ mr: 0.5 }}>{star}</Typography>
                <StarIcon sx={{ fontSize: '1.2rem', color: current >= star ? 'var(--secondary-color)' : '#ccc' }} />
            </Box>
        ))}
    </Box>
);

const HotelDetail = () => {
    const { id } = useParams();
    const reviewMsgRef = useRef('');
    const hasFetchedSummary = useRef(false);

    const [hotelRating, setHotelRating] = useState(null);
    const [summary, setSummary] = useState('');
    const [reviewList, setReviewList] = useState([]);

    const { user } = useContext(AuthContext);

    const { data: hotel, loading, error } = useFetch(`${BASE_URL}/hotels/${id}`);
    const { photo, hotelName, stars, roomsAvailable, pricePerNight, location, amenities, reviews = [] } = hotel || {};
    const { avgRating } = calculateAvgRating(reviewList);
    const [page, setPage] = useState(1);
    const reviewsPerPage = 8;

    const location1 = useLocation();

    const updateSummary = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/review/summary/${id}/Hotel`);
            setSummary(data.success ? data.summary : 'Không thể tải tóm tắt đánh giá.');
        } catch (error) {
            setSummary('Không thể tải tóm tắt đánh giá.');
        }
    };

    useEffect(() => {
        if (hotel && reviews.length > 0 && !hasFetchedSummary.current) {
            setReviewList(reviews);
            hasFetchedSummary.current = true;
            updateSummary();
        }
    }, [hotel]);

    const reversedReviews = useMemo(() => reviewList.slice().reverse(), [reviewList]);
    const pageCount = Math.ceil(reversedReviews.length / reviewsPerPage);
    const displayedReviews = reversedReviews.slice((page - 1) * reviewsPerPage, page * reviewsPerPage);

    const refetchHotelData = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/hotels/${id}`);
            if (res.data.success) {
                window.location.reload(); // đơn giản: reload luôn cả trang
            }
        } catch (error) {
            console.error('Failed to refetch hotel data', error);
        }
    };


    const renderSummary = () => {
        if (reviewList.length === 0) {
            return <Typography variant="h6"
                fontSize="1rem"
                sx={{ fontFamily: 'Mulish', pr: 5 }}>No reviews yet. Be the first to leave a comment!</Typography>;
        }

        if (!summary) return <p>Loading summary...</p>;

        const { positive, negative, impression } = extractSummarySections(summary);
        return (
            <Box mb={3}>
                <div><h6>Positive Reviews:</h6><p>{positive || 'No positive reviews yet.'}</p></div>
                <div><h6>Negative Reviews:</h6><p>{negative || 'No negative reviews yet.'}</p></div>
                <div><h6>Overall Impression:</h6><p>{impression || 'No overall impression yet.'}</p></div>
            </Box>
        );
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const reviewText = reviewMsgRef.current.value;
        try {
            if (!user) return alert('Please sign in');
            const resBookings = await axios.get(`${BASE_URL}/booking/hotel/all`, { withCredentials: true });
            const bookings = resBookings.data.data || [];
            const hotelBooked = bookings.some(b => b.hotelName === hotelName);
            if (!hotelBooked) return alert('You have never booked this hotel before.');

            const reviewObj = {
                userId: user._id,
                reviewText,
                rating: hotelRating,
                targetId: id,
                reviewTargetType: 'Hotel'
            };

            const res = await axios.post(`${BASE_URL}/review`, reviewObj, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' },
            });
            if (!res.data.success) return alert(res.data.message);

            const newReview = res.data.data;
            setReviewList(prev => [...prev, newReview]);
            setHotelRating(null);
            reviewMsgRef.current.value = '';
            updateSummary();
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [hotel]);

    useEffect(() => {
        if (document.referrer.includes('checkout')) { // giả sử từ trang thanh toán quay về
            refetchHotelData();
        }
    }, []);

    const dateFormat = { day: 'numeric', month: 'long', year: 'numeric' };

    return (
        <section>
            <Container>
                {loading && <h4 className="text-center pt-5">Loading...</h4>}
                {error && <h4 className="text-center pt-5">{error}</h4>}
                {!loading && !error && (
                    <Row>
                        <Typography variant="h6" gutterBottom sx={{ fontSize: 36, fontFamily: 'Volkhov, Georgia, serif', fontWeight: 700, color: '#1C2B38' }}>{hotelName}</Typography>
                        <Box display="flex" alignItems="center" gap={2} mb={4}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <FmdGoodRoundedIcon fontSize="small" color="action" />
                                <Typography variant="body1" color="text.secondary" sx={{ fontFamily: 'Mulish' }}>{location}</Typography>
                            </Box>
                            <Box sx={{ width: '1px', height: 20, backgroundColor: '#ccc' }} />
                            <StarIcon sx={{ color: '#FFC107' }} />
                            <Typography variant="body1" color="text.secondary" sx={{ fontFamily: 'Mulish' }}>{Number(avgRating).toFixed(1)}</Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ fontFamily: 'Mulish' }}>({reviewList.length} reviews)</Typography>
                        </Box>
                        <Col lg="8">
                            <Box>
                                <Box component="img" src={photo} alt="" sx={{ width: '100%', borderRadius: 2 }} />
                                <Box mt={2} ml={2} sx={{
                                    borderBottom: '1px solid #ccc', // hoặc '#e0e0e0' tùy độ sáng mong muốn
                                    pb: 2 // padding bottom để nội dung không sát viền
                                }}>
                                    <Typography variant="h6" fontWeight={700} mb={2} sx={{ fontFamily: 'Mulish' }}>Description</Typography>
                                    <Typography variant="body1" mb={2} sx={{ fontFamily: 'Mulish' }}><strong>Price:</strong> ${pricePerNight} / night</Typography>
                                    <Typography variant="body1" mb={2} sx={{ fontFamily: 'Mulish' }}><strong>Stars:</strong> {stars}</Typography>
                                    <Typography variant="body1" mb={2} sx={{ fontFamily: 'Mulish' }}><strong>Amenities:</strong> {amenities?.join(', ')}</Typography>
                                    <Typography variant="body1" mb={2} sx={{ fontFamily: 'Mulish' }}><strong>Rooms available:</strong> {roomsAvailable}</Typography>
                                </Box>
                                <Box mt={4} ml={2}>
                                    <Typography variant="h6" fontWeight={700} mb={2} sx={{ fontFamily: 'Mulish' }}>Reviews ({reviewList.length})</Typography>
                                    {renderSummary()}
                                    <Box component="form" onSubmit={submitHandler} sx={{ p: 1, mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <RatingStars current={hotelRating} onRate={setHotelRating} />
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, borderRadius: '2rem', border: '1px solid', borderColor: '#ccc', pr: 2, pt: 1, pb: 1 }}>
                                            <TextField
                                                inputRef={reviewMsgRef}
                                                placeholder="Share your thoughts"
                                                required
                                                variant="standard"
                                                fullWidth
                                                InputProps={{ disableUnderline: true, sx: { px: 1, fontSize: '1rem', color: 'var(--text-color)' } }}
                                                sx={{ flex: 1, '& .MuiInputBase-root': { paddingY: '0.5rem' } }}
                                            />
                                            <Button type="submit" variant="contained" sx={{ borderRadius: '2rem', textTransform: 'none', px: 3, py: 1, backgroundColor: 'var(--secondary-color)' }}>Submit</Button>
                                        </Box>
                                    </Box>
                                    <List sx={{ mt: 5 }}>
                                        {displayedReviews.map((review, index) => (
                                            <ListItem key={index} alignItems="flex-start" sx={{ width: '95%', display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3, px: 0, p: 1 }}>
                                                <ListItemAvatar>
                                                    <Avatar alt="avatar" src={review.userId?.photo || "https://t4.ftcdn.net/jpg/08/75/45/97/360_F_875459719_8i7J3atGbsDoRPT0ZW0DjBpgAFVTrKAe.jpg"} sx={{ width: 40, height: 40 }} />
                                                </ListItemAvatar>
                                                <Box sx={{ flex: 1 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                        <Box>
                                                            <Typography variant="body1" fontSize="1rem" mb={0} sx={{ fontFamily: 'Mulish', fontWeight: 600 }}>{review.userId?.username || 'Anonymous'}</Typography>
                                                            <Typography variant="body2" fontSize="0.8rem">{new Date(review.createdAt).toLocaleDateString('en-US', dateFormat)}</Typography>
                                                        </Box>
                                                        <Box display="flex" alignItems="center" fontWeight={500}>
                                                            <Typography sx={{ mr: 0.5 }}>{review.rating}</Typography>
                                                            <StarIcon sx={{ fontSize: 20, color: 'var(--secondary-color)' }} />
                                                        </Box>
                                                    </Box>
                                                    <Typography variant="h6" fontSize="1rem" sx={{ fontFamily: 'Mulish', pr: 5 }}>{review.reviewText}</Typography>
                                                </Box>
                                            </ListItem>
                                        ))}
                                    </List>
                                    <Pagination count={pageCount} page={page} onChange={(event, value) => setPage(value)} sx={{ display: 'flex', justifyContent: 'center', mt: 2, color: 'var(--secondary-color)' }} />
                                </Box>
                            </Box>
                        </Col>
                        <Col lg="4">
                            <BookingForm item={hotel} type="hotel" avgRating={avgRating} />
                        </Col>
                    </Row>
                )}
            </Container>
        </section>
    );
};

export default HotelDetail;


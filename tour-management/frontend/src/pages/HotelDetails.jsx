// import React, { useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { Col, Container, Row } from 'reactstrap';
// import useFetch from '../hooks/useFetch';
// import { BASE_URL } from '../utils/config';
// import CommonSection from './../shared/CommonSection';
// import Booking from '../components/Booking/Booking';
// import '../styles/hotel-details.css';
// import BookingHotel from '../components/Booking/BookingHotel';
// import BookingForm from '../components/Booking/BookingForm';

// const HotelDetail = () => {
//     const { id } = useParams();
//     const { data: hotel, loading, error } = useFetch(`${BASE_URL}/hotels/${id}`);
//     const { photo, hotelName, desc, pricePerNight, location, amenities } = hotel || {};

//     useEffect(() => {
//         window.scrollTo(0, 0);
//     }, []);

//     return (
//         <section>
//             {/* <CommonSection title="Hotel Details" /> */}
//             <Container>
//                 {loading && <h4 className="text-center pt-5">Loading...</h4>}
//                 {error && <h4 className="text-center pt-5">{error}</h4>}
//                 {!loading && !error && (
//                     <Row>
//                         <Col lg="8">
//                             <div className="hotel__content">
//                                 <img src={photo} alt="hotel" className="hotel__img" />
//                                 <div className="hotel__info">
//                                     <h2>{hotelName}</h2>
//                                     <div className="d-block mb-2">
//                                         <div className="mb-1"><i className="ri-map-pin-fill"></i> Location: {location}</div>
//                                         <div><i className="ri-hotel-line"></i> Amenities: {amenities?.join(', ')}</div>
//                                     </div>
//                                     <div className="hotel__price">
//                                         <i className="ri-money-dollar-circle-line"></i> ${pricePerNight} / night
//                                     </div>
//                                     <h5>Description</h5>
//                                     <p>{desc}</p>
//                                 </div>
//                             </div>
//                         </Col>
//                         <Col lg="4">
//                             {/* <BookingHotel hotel={hotel} /> */}
//                             <BookingForm item={hotel} type="hotel" />
//                         </Col>
//                     </Row>
//                 )}
//             </Container>
//         </section>
//     );
// };

// export default HotelDetail;


import React, { useContext, useEffect, useRef, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Container, Form, ListGroup, Row } from 'reactstrap';
import axios from 'axios';
import avatar from '../assets/images/avatar.jpg';
import { AuthContext } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import '../styles/hotel-details.css';
import calculateAvgRating from '../utils/avgRating';
import { BASE_URL } from '../utils/config';
import BookingForm from '../components/Booking/BookingForm';

const extractSummarySections = (raw) => {
    const cleaned = raw.replace(/\*/g, '').trim();
    const positive = cleaned.match(/Positive Aspects:\s*(.*?)(?=Negative Aspects:|$)/s)?.[1]?.trim();
    const negative = cleaned.match(/Negative Aspects:\s*(.*?)(?=General User Impressions:|$)/s)?.[1]?.trim();
    const impression = cleaned.match(/General User Impressions:\s*(.*?)(?=$)/s)?.[1]?.trim();
    return { positive, negative, impression };
};

const RatingStars = ({ current, onRate }) => (
    <div className="d-flex align-items-center gap-3 mb-4 rating__group">
        {[1, 2, 3, 4, 5].map(star => (
            <span key={star} onClick={() => onRate(star)}>
                {star} <i className={`ri-star-fill ${current >= star ? 'filled' : ''}`}></i>
            </span>
        ))}
    </div>
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
    const { photo, hotelName, desc, pricePerNight, location, amenities, reviews = [] } = hotel || {};
    const { totalRating, avgRating } = calculateAvgRating(reviewList);

    const updateSummary = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/review/summary/${id}/Hotel`);
            setSummary(data.success ? data.summary : 'Không thể tải tóm tắt đánh giá.');
        } catch (error) {
            setSummary('Không thể tải tóm tắt đánh giá.');
        }
    };

    useEffect(() => {
        if (hotel && reviews && reviews.length > 0 && !hasFetchedSummary.current) {
            setReviewList(reviews);
            hasFetchedSummary.current = true;
            updateSummary();
        }
    }, [hotel]);

    const reversedReviews = useMemo(() => reviewList.slice().reverse(), [reviewList]);

    const renderSummary = () => {
        if (!summary) return <p>Loading summary...</p>;
        const { positive, negative, impression } = extractSummarySections(summary);
        return (
            <div className="review__summary">
                <div><h6>Positive Reviews:</h6><p>{positive || 'No positive reviews yet.'}</p></div>
                <div><h6>Negative Reviews:</h6><p>{negative || 'No negative reviews yet.'}</p></div>
                <div><h6>Overall Impression:</h6><p>{impression || 'No overall impression yet.'}</p></div>
            </div>
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

    const dateFormat = { day: 'numeric', month: 'long', year: 'numeric' };

    return (
        <section>
            <Container>
                {loading && <h4 className="text-center pt-5">Loading...</h4>}
                {error && <h4 className="text-center pt-5">{error}</h4>}
                {!loading && !error && (
                    <Row>
                        <Col lg="8">
                            <div className="hotel__content">
                                <img src={photo} alt="hotel" className="hotel__img" />
                                <div className="hotel__info">
                                    <h2>{hotelName}</h2>
                                    <div className="d-block mb-2">
                                        <div className="mb-1"><i className="ri-map-pin-fill"></i> Location: {location}</div>
                                        <div><i className="ri-hotel-line"></i> Amenities: {amenities?.join(', ')}</div>
                                    </div>
                                    <div className="hotel__price">
                                        <i className="ri-money-dollar-circle-line"></i> ${pricePerNight} / night
                                    </div>
                                    <h5>Description</h5>
                                    <p>{desc}</p>
                                </div>

                                <div className="tour__reviews mt-4">
                                    <h4>Reviews ({reviewList.length} reviews)</h4>
                                    {renderSummary()}

                                    <Form onSubmit={submitHandler}>
                                        <RatingStars current={hotelRating} onRate={setHotelRating} />
                                        <div className="review__input">
                                            <input type="text" ref={reviewMsgRef} placeholder="Share your thoughts" required />
                                            <button className="btn primary__btn text-white" type="submit">Submit</button>
                                        </div>
                                    </Form>

                                    <ListGroup className="user__reviews">
                                        {reversedReviews.map((review, index) => (
                                            <div className="review__item" key={index}>
                                                <img
                                                    src={review.userId?.photo || avatar}
                                                    alt="avatar"
                                                    className="review__avatar"
                                                />
                                                <div className="w-100">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <div>
                                                            <h5>{review.userId?.username || 'Anonymous'}</h5>
                                                            <p>{new Date(review.createdAt).toLocaleDateString('en-US', dateFormat)}</p>
                                                        </div>
                                                        <span className="d-flex align-items-center">
                                                            {review.rating} <i className="ri-star-s-fill"></i>
                                                        </span>
                                                    </div>
                                                    <h6>{review.reviewText}</h6>
                                                </div>
                                            </div>
                                        ))}
                                    </ListGroup>
                                </div>
                            </div>
                        </Col>
                        <Col lg="4">
                            <BookingForm item={hotel} type="hotel" />
                        </Col>
                    </Row>
                )}
            </Container>
        </section>
    );
};

export default HotelDetail;

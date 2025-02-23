import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Container, Form, ListGroup, Row } from 'reactstrap';
import avatar from '../assets/images/avatar.jpg';
import Booking from '../components/Booking/Booking';
import { AuthContext } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import '../styles/tour-details.css';
import calculateAvgRating from '../utils/avgRating';
import { BASE_URL } from '../utils/config';

const TourDetails = () => {
  const { id } = useParams();
  const reviewMsgRef = useRef('');
  const [tourRating, setTourRating] = useState(null);
  const [summary, setSummary] = useState(''); // State for summary
  const { user } = useContext(AuthContext);

  // Fetch data from database
  const { data: tour, loading, error } = useFetch(`${BASE_URL}/tours/${id}`);
  const { photo, title, desc, price, address, reviews, city, distance, maxGroupSize } = tour || {};
  const { totalRating, avgRating } = calculateAvgRating(reviews);

  // Format date
  const options = { day: 'numeric', month: 'long', year: 'numeric' };

  // API lấy summary từ backend
  const fetchSummary = async () => {
    try {
      const res = await fetch(`${BASE_URL}/review/summary/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await res.json();

      if (result.success) {
        setSummary(result.summary);
      } else {
        setSummary('Không thể tải tóm tắt đánh giá.');
      }
    } catch (error) {
      console.error("Lỗi khi lấy tóm tắt đánh giá:", error);
      setSummary('Không thể tải tóm tắt đánh giá.');
    }
  };

  // Gọi API lấy summary khi component được tải
  useEffect(() => {
    if (id) {
      fetchSummary();
    }
  }, [id]);

  // Gọi API lấy summary khi có review mới
  const handleNewReview = async () => {
    await fetchSummary(); // Gọi lại API để cập nhật tóm tắt
  };


  // Updated renderSummary function
  const renderSummary = () => {
    if (summary) {
      // Loại bỏ các dấu * bằng cách thay thế chúng bằng khoảng trắng hoặc chuỗi rỗng
      const cleanedSummary = summary.replace(/\*/g, "").trim();

      // Tách summary thành các đoạn khác nhau dựa trên các tiêu đề
      const positive = cleanedSummary.match(/Positive Aspects:\s*(.*?)(?=Negative Aspects:|$)/s)?.[1]?.trim();
      const negative = cleanedSummary.match(/Negative Aspects:\s*(.*?)(?=General User Impressions:|$)/s)?.[1]?.trim();
      const impression = cleanedSummary.match(/General User Impressions:\s*(.*?)(?=$)/s)?.[1]?.trim();

      return (
        <div className="review__summary">
          <div>
            <h6>Positive Reviews:</h6>
            <p>{positive || 'No positive reviews yet.'}</p>
          </div>
          <div>
            <h6>Negative Reviews:</h6>
            <p>{negative || 'No negative reviews yet.'}</p>
          </div>
          <div>
            <h6>Overall Impression:</h6>
            <p>{impression || 'No overall impression yet.'}</p>
          </div>
        </div>
      );
    }

    return <p>Loading summary...</p>;
  };


  const submitHandler = async (e) => {
    e.preventDefault();
    const reviewText = reviewMsgRef.current.value;

    try {
      if (!user) {
        alert('Please sign in');
        return;
      }

      // Fetch bookings
      const resBookings = await fetch(`${BASE_URL}/booking/booking-history/all`, {
        method: 'GET',
        credentials: 'include',
      });
      const resultBooking = await resBookings.json();

      if (!resultBooking.success) {
        alert(resultBooking.message);
        return;
      }

      const bookings = resultBooking.data;
      if (!Array.isArray(bookings)) {
        alert('Đã có lỗi xảy ra trong việc lấy danh sách đặt tour.');
        return;
      }

      const tourBooked = bookings.some((booking) => booking.tourName === title);
      if (!tourBooked) {
        alert('You have never booked this tour before.');
        return;
      }

      const reviewObj = {
        username: user?.username,
        reviewText,
        rating: tourRating,
      };

      const res = await fetch(`${BASE_URL}/review/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(reviewObj),
      });

      const result = await res.json();
      if (!res.ok) {
        alert(result.message);
        return;
      }

      // Update reviews
      const newReview = {
        username: user.username,
        reviewText,
        rating: tourRating,
        createdAt: new Date().toISOString(),
      };

      tour.reviews = [...reviews, newReview];
      reviewMsgRef.current.value = '';
      setTourRating(null);

      // update summary after add review
      handleNewReview();

    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tour]);



  return (
    <>
      <section>
        <Container>
          {loading && <h4 className="text-center pt-5">Loading ......</h4>}
          {error && <h4 className="text-center pt-5">{error}</h4>}
          {!loading && !error && (
            <Row>
              <Col lg="8">
                <div className="tour__content">
                  <img src={photo} alt="" />
                  <div className="tour__info">
                    <h2>{title}</h2>
                    <div className="d-flex align-items-center gap-5">
                      <span className="tour__rating d-flex align-items-center gap-1">
                        <i className="ri-star-fill" style={{ color: 'var(--secondary-color)' }}></i>
                        {avgRating === 0 ? null : avgRating}
                        {totalRating === 0 ? 'Not rated' : <span>({reviews?.length})</span>}
                      </span>
                      <span>
                        <i className="ri-map-pin-fill"></i> {address}
                      </span>
                    </div>
                    <div className="tour__extra-details">
                      <span>
                        <i className="ri-map-pin-2-line"></i> {city}
                      </span>
                      <span>
                        <i className="ri-money-dollar-circle-line"></i> ${price} / per person
                      </span>
                      <span>
                        <i className="ri-pin-distance-line"></i> {distance} km
                      </span>
                      <span>
                        <i className="ri-group-line"></i> {maxGroupSize} people
                      </span>
                    </div>
                    <h5>Description</h5>
                    <p>{desc}</p>
                  </div>

                  {/* Tour reviews section */}
                  <div className="tour__reviews mt-4">

                    <h4>Reviews ({reviews?.length} reviews)</h4>

                    {/* Display summary */}
                    {renderSummary()}

                    <Form onSubmit={submitHandler}>
                      <div className="d-flex align-items-center gap-3 mb-4 rating__group">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} onClick={() => setTourRating(star)}>
                            {star} <i className={`ri-star-fill ${tourRating >= star ? 'filled' : ''}`}></i>
                          </span>
                        ))}
                      </div>

                      <div className="review__input">
                        <input type="text" ref={reviewMsgRef} placeholder="share your thoughts"
                          required />
                        <button className="btn primary__btn text-white" type="submit">
                          Submit
                        </button>
                      </div>
                    </Form>

                    <ListGroup className="user__reviews">
                      {reviews?.map((review) => (
                        <div className="review__item" key={review.createdAt}>
                          <img src={avatar} alt="" />
                          <div className="w-100">
                            <div
                              className="d-flex align-items-center justify-content-between">
                              <div>
                                <h5>{review.username}</h5>
                                <p>{new Date(review.createdAt).toLocaleDateString('en-US', options)}</p>
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
                <Booking tour={tour} avgRating={avgRating} />
              </Col>
            </Row>
          )}
        </Container>
      </section>
    </>
  );
};

export default TourDetails;
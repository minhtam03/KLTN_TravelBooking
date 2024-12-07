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
// import { GoogleGenerativeAI } from "@google/generative-ai";
import { HumanMessage } from "@langchain/core/messages";
import { ChatGroq } from "@langchain/groq";

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

  // Get summary from API
  const getSummary = async (reviews) => {

    const model = new ChatGroq({
      apiKey: process.env.REACT_APP_API_KEY, // Default value.
    });

    const message = new HumanMessage(`
          Summarize the following reviews:
          ${reviews.join('\n')}
          
          Summarize the following reviews briefly and usefully. 
          Structure the summary into three separate paragraphs: one for the positive aspects, one for the negative aspects, and one for general user impressions. 
          Each paragraph should be short and to the point, include two sentences 
        `);
      
    const res = await model.invoke([message]);

    if (res && res.content) {
      return res.content;
    }
    
    // Return res if content is missing to help with error debugging
    return res;
  };


  useEffect(() => {
    if (reviews && reviews.length > 0) {
      (async function () {
        try {
          const summaryText = await getSummary(reviews.map((review) => review.reviewText));
          console.log("API Summary Content:", summaryText);
  
          if (summaryText) {
            setSummary(summaryText);
          } else {
            console.error("Unexpected summary structure:", summaryText);
            setSummary('Unable to load summary.');
          }
        } catch (error) {
          console.error("Error in fetching summary:", error);
          setSummary('Unable to load summary.');
        }
      })();
    }
  }, [reviews]);

  // Updated renderSummary function
const renderSummary = () => {
  if (summary) {
    // Split summary text into sections based on known headers
    const positive = summary.match(/Positive Aspects:\s*(.*?)(?=Negative Aspects:|$)/s)?.[1]?.trim();
    const negative = summary.match(/Negative Aspects:\s*(.*?)(?=General User Impressions:|$)/s)?.[1]?.trim();
    const impression = summary.match(/General User Impressions:\s*(.*?)(?=$)/s)?.[1]?.trim();

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
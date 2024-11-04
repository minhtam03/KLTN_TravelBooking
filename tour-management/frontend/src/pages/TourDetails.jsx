import React, {useEffect, useRef, useState, useContext} from 'react'
import '../styles/tour-details.css'
import { Container, Row, Col, Form, ListGroup } from 'reactstrap'
import { useParams } from 'react-router-dom'
import calculateAvgRating from '../utils/avgRating'
import avatar from '../assets/images/avatar.jpg'
import Booking from '../components/Booking/Booking'
import useFetch from '../hooks/useFetch'
import { BASE_URL } from '../utils/config'
import { AuthContext } from '../context/AuthContext'

const TourDetails = () => {

  const {id} = useParams() 
  const reviewMsgRef = useRef('')
  const [tourRating, setTourRating] = useState(null)

  const {user} = useContext(AuthContext)

  // fetch data from database
  const {data: tour, loading, error} = useFetch(`${BASE_URL}/tours/${id}`)

  const {photo, title, desc, price, address, reviews, city, distance, maxGroupSize} =
  tour

  const {totalRating, avgRating} = calculateAvgRating(reviews)

  // format date
  const options = {day: "numeric", month: "long", year: "numeric"}

  
  const submitHandler = async (e) => {
    e.preventDefault();
    const reviewText = reviewMsgRef.current.value;
  
    try {
      if (!user) {
        alert('Please sign in');
        return;
      }

      // Lấy danh sách bookings của người dùng
      const resBookings = await fetch(`${BASE_URL}/booking/booking-history/all`, {
          method: 'GET',
          credentials: 'include',
        });
      const resultBooking = await resBookings.json();

      // Kiểm tra phản hồi từ API
      if (!resultBooking.success) {
          alert(resultBooking.message); // Hiển thị thông báo lỗi từ API
          return;
      }

      const bookings = resultBooking.data; // Dữ liệu bookings từ API

      // Kiểm tra kiểu dữ liệu của bookings
      if (!Array.isArray(bookings)) {
          console.error("Bookings is not an array:", bookings);
          alert("Đã có lỗi xảy ra trong việc lấy danh sách đặt tour.");
          return;
      }

      // Kiểm tra xem user đã đặt tour này chưa
      const tourBooked = bookings.some(booking => booking.tourName === title);

      if (!tourBooked) {
          alert("You have never booked this tour before.");
          return;
      }


       
  
      const reviewObj = {
        username: user?.username,
        reviewText,
        rating: tourRating
      };
  
      const res = await fetch(`${BASE_URL}/review/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(reviewObj)
      });
  
      const result = await res.json();
      if (!res.ok) {
        alert(result.message);
        return;
      }
  
      // Cập nhật state của reviews để hiển thị review mới ngay lập tức
      const newReview = {
        username: user.username,
        reviewText,
        rating: tourRating,
        createdAt: new Date().toISOString()
      };
  
      // Thêm review mới vào danh sách reviews hiện tại
      tour.reviews = [...reviews, newReview];
      reviewMsgRef.current.value = '';
      setTourRating(null);
  
    } catch (err) {
      alert(err.message);
    }
  };


  useEffect(() => {
    window.scrollTo(0, 0)
  }, [tour])

  return (
  <>
    <section>
      <Container>
        {loading && <h4 className='text-center pt-5'>Loading ......</h4>}
        {error && <h4 className='text-center pt-5'>{error}</h4>}
        {!loading && !error && (
          <Row>
          <Col lg='8'>
            <div className="tour__content">
              <img src={photo} alt="" />
              <div className="tour__info">
                <h2>{title}</h2>

                <div className='d-flex align-items-center gap-5'>
                  <span className='tour__rating d-flex align-items-center gap-1'>
                      <i class="ri-star-fill" style={{'color':"var(--secondary-color)"}}></i> 
                      {avgRating === 0 ? null : avgRating}
                      {totalRating === 0 ? "Not rated" : (<span>({reviews?.length})</span>)}
                  </span>
                  <span>
                    <i class="ri-map-pin-fill"></i> {address}
                  </span>
                </div>

                <div className='tour__extra-details'>
                  <span>
                    <i class="ri-map-pin-2-line"></i> {city}
                  </span>
                  <span>
                    <i class="ri-money-dollar-circle-line"></i> ${price} / per person
                  </span>
                  <span>
                  <i class="ri-pin-distance-line"></i> {distance} km
                  </span>
                  <span>
                  <i class="ri-group-line"></i> {maxGroupSize} people
                  </span>
                </div>

                <h5>Description</h5>
                <p>{desc}</p>
              </div>

              {/* tour reviews section */}
              <div className="tour__reviews mt-4">
                <h4>
                  Reviews ({reviews?.length} reviews)
                </h4>
                <Form onSubmit={submitHandler}>

                  {/* <div className='d-flex align-items-center gap-3 mb-4
                  rating__group'>
                    <span onClick={() => setTourRating(1)}>1 <i class="ri-star-fill"></i></span>
                    <span onClick={() => setTourRating(2)}>2 <i class="ri-star-fill"></i></span>
                    <span onClick={() => setTourRating(3)}>3 <i class="ri-star-fill"></i></span>
                    <span onClick={() => setTourRating(4)}>4 <i class="ri-star-fill"></i></span>
                    <span onClick={() => setTourRating(5)}>5 <i class="ri-star-fill"></i></span>
                  </div> */}

                  <div className='d-flex align-items-center gap-3 mb-4 rating__group'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} onClick={() => setTourRating(star)}>
                        {star} <i className={`ri-star-fill ${tourRating >= star ? 'filled' : ''}`}></i>
                      </span>
                    ))}
                  </div>



                  <div className="review__input">
                    <input type="text" ref={reviewMsgRef} 
                    placeholder='share your thoughts'required/>
                    <button className='btn primary__btn text-white'
                    type='submit'>
                        Submit
                    </button>
                  </div>
                </Form>

                <ListGroup className='user__reviews'>
                  {
                    reviews?.map(review => (
                      <div className='review__item'>
                        <img src={avatar} alt="" />
                        <div className="w-100">
                          <div className='d-flex align-items-center 
                          justify-content-between'>
                            <div>
                              <h5>{review.username}</h5>
                              <p>
                                {new Date(review.createdAt).toLocaleDateString("en-US", options)}
                              </p>
                            </div>
                            <span className='d-flex align-items-center'>
                              {review.rating} <i class="ri-star-fill"></i>
                            </span>
                          </div>
                          <h6>{review.reviewText}</h6>
                        </div>
                      </div>
                    ))
                  }
                </ListGroup>
              </div>
            </div>
          </Col>

          {/* booking  */}
          <Col lg='4'>
            <Booking tour={tour} avgRating={avgRating}/>
          </Col>
        </Row>
        )}
        
      </Container>
    </section>
  </>)
}

export default TourDetails
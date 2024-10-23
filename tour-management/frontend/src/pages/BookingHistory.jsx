import React, { useState, useEffect, useContext } from 'react';
import CommonSection from '../shared/CommonSection';
import '../styles/booking-history.css';
import { Container, Row, Col } from 'reactstrap';
import { BASE_URL } from '../utils/config';
import useFetch from '../hooks/useFetch';
import { AuthContext } from '../context/AuthContext'

const BookingHistory = () => {
  const { user } = useContext(AuthContext);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);

  // Fetch user's booking data
  const { data: bookings, loading, error } = useFetch(
    `${BASE_URL}/bookings?userId=${user?._id}&page=${page}`
  );
  const { data: bookingCount } = useFetch(`${BASE_URL}/bookings/count?userId=${user?._id}`);

  useEffect(() => {
    const pages = Math.ceil(bookingCount / 4); // Assuming 4 bookings per page
    setPageCount(pages);
    window.scrollTo(0, 0);
  }, [page, bookingCount, bookings]);

  return (
    <>
      <CommonSection title={'Booking History'} />
      <section>
        <Container>
          <Row>
            {loading && <h4 className='text-center pt-5'>Loading...</h4>}
            {error && <h4 className='text-center pt-5'>{error}</h4>}
            {!loading && !error && (
              <Row>
                {bookings?.map((booking) => (
                  <Col lg='3' className='mb-4' key={booking._id}>
                    <div className='booking-card'>
                      <img src='path/to/image' alt={booking.tourName} className='booking-card-img' />
                      <div className='booking-info'>
                        <h5>{booking.tourName}</h5>
                        <p>{new Date(booking.bookAt).toLocaleDateString()}</p>
                        <p>Guest: {booking.guestSize} people</p>
                        <p>Total payment: ${(booking.guestSize * 35).toFixed(2)}</p>
                      </div>
                    </div>
                  </Col>
                ))}
                <Col lg='12'>
                  <div className='pagination d-flex align-items-center justify-content-center mt-4 gap-3'>
                    {[...Array(pageCount).keys()].map((number) => (
                      <span
                        key={number}
                        onClick={() => setPage(number)}
                        className={page === number ? 'active__page' : ''}
                      >
                        {number + 1}
                      </span>
                    ))}
                  </div>
                </Col>
              </Row>
            )}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default BookingHistory;

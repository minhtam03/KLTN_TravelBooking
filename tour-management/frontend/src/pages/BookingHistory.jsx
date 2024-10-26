import React, { useEffect, useContext, useState } from 'react';
import { Container, ListGroup, ListGroupItem } from 'reactstrap';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../utils/config';
import CommonSection from '../shared/CommonSection'

const BookingHistory = () => {
  const { user } = useContext(AuthContext); // Lấy thông tin người dùng từ AuthContext
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        if (!user) {
          setError("Please sign in to view your booking history.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${BASE_URL}/booking/booking-history`, {
          method: 'GET',
          credentials: 'include',
        });


        const result = await res.json();

        if (!res.ok) {
          setError(result.message);
        } else {
          setBookings(result.data);
        }
      } catch (err) {
        setError("Failed to fetch booking history.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingHistory();
  }, [user]);

  return (
    <Container className="booking-history">
      <CommonSection title={"Your Booking History"}/>

      {loading && <p>Loading...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && bookings.length === 0 && !error && <p>No bookings found.</p>}

      {bookings.length > 0 && (
        <ListGroup>
          {bookings.map((booking) => (
            <ListGroupItem key={booking._id} className="booking-item">
              <h5>{booking.tourName}</h5>
              <p>Full Name: {booking.fullName}</p>
              <p>Phone: {booking.phone}</p>
              <p>Guests: {booking.guestSize}</p>
              <p>Booking Date: {new Date(booking.bookAt).toLocaleDateString()}</p>
            </ListGroupItem>
          ))}
        </ListGroup>
      )}
    </Container>
  );
};

export default BookingHistory;

import React, { useEffect, useContext } from 'react';
import { Container } from 'reactstrap';
import useFetch from '../hooks/useFetch';
import { BASE_URL } from '../utils/config';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const BookingHistory = () => {
  const { user } = useContext(AuthContext); // Lấy thông tin user từ AuthContext

  // Use the useFetch hook to get the user's booking history
  const { data: bookings, loading, error } = useFetch(user ? `${BASE_URL}/booking/user/${user._id}` : null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container>
      <h2>Your Booking History</h2>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      
      {!user && <p>Please sign in to view your booking history.</p>}

      {bookings?.length === 0 && !loading && <p>No bookings found.</p>}
      
      {/* Display bookings in a simple table or list */}
      {bookings?.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Tour Name</th>
              <th>Full Name</th>
              <th>Guest Size</th>
              <th>Phone</th>
              <th>Booking Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.tourName}</td>
                <td>{booking.fullName}</td>
                <td>{booking.guestSize}</td>
                <td>{booking.phone}</td>
                <td>{new Date(booking.bookAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Container>
  );
};

export default BookingHistory;

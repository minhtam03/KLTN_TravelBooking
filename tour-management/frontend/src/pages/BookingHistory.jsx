import React, { useEffect, useContext, useState } from 'react';
import { Container, ListGroup, ListGroupItem, Row, Col } from 'reactstrap';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../utils/config';
import CommonSection from '../shared/CommonSection'
import BookingCard from '../shared/BookingCard';

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

        const res = await fetch(`${BASE_URL}/bookings/booking-history/all`, {
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
    // <Container className="booking-history">
    //   <CommonSection title={"Your Booking History"}/>

    //   {loading && <p>Loading...</p>}
    //   {error && <p className="error-text">{error}</p>}
    //   {!loading && bookings.length === 0 && !error && <p>No bookings found.</p>}

    //   {bookings.length > 0 && (
    //     <ListGroup>
    //       {bookings.map((booking) => (
    //         <ListGroupItem key={booking._id} className="booking-item">
    //           <h5>{booking.tourName}</h5>
    //           <p>Full Name: {booking.fullName}</p>
    //           <p>Phone: {booking.phone}</p>
    //           <p>Guests: {booking.guestSize}</p>
    //           <p>Booking Date: {new Date(booking.bookAt).toLocaleDateString()}</p>
    //         </ListGroupItem>
    //       ))}
    //     </ListGroup>
    //   )}
    // </Container>
    <Container className="booking-history">
      <CommonSection title={"Your Booking History"}/>

      {loading && <p>Loading...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && bookings.length === 0 && !error && <p>No bookings found.</p>}

      <Row>
        {bookings.map((booking) => (
          <Col lg="3" md="6" sm="12" key={booking._id} className="mb-4">
            <BookingCard booking={booking} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default BookingHistory;


// import React, { useEffect, useContext, useState } from 'react';
// import { Container, Row, Col, Card, CardBody, CardTitle, CardSubtitle, CardText, Button } from 'reactstrap';
// import { AuthContext } from '../context/AuthContext';
// import { BASE_URL } from '../utils/config';
// import CommonSection from '../shared/CommonSection';

// const BookingHistory = () => {
//   const { user } = useContext(AuthContext); // Get user info from AuthContext
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchBookingHistory = async () => {
//       try {
//         if (!user) {
//           setError("Please sign in to view your booking history.");
//           setLoading(false);
//           return;
//         }

//         const res = await fetch(`${BASE_URL}/bookings/booking-history/all`, {
//           method: 'GET',
//           credentials: 'include',
//         });

//         const result = await res.json();

//         if (!res.ok) {
//           setError(result.message);
//         } else {
//           setBookings(result.data);
//         }
//       } catch (err) {
//         setError("Failed to fetch booking history.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookingHistory();
//   }, [user]);

//   return (
//     <Container className="booking-history">
//       <CommonSection title="Your Booking History" />

//       {loading && <p>Loading...</p>}
//       {error && <p className="error-text">{error}</p>}
//       {!loading && bookings.length === 0 && !error && <p>No bookings found.</p>}

//       <Row>
//         {bookings.length > 0 && bookings.map((booking) => (
//           <Col md="6" lg="3" key={booking._id} className="mb-4">
//             <Card className="booking-card">
//               <img
//                 src={booking.imageUrl || 'default-image.jpg'} // Replace with booking's image URL
//                 alt={booking.tourName}
//                 className="card-img-top"
//               />
//               <CardBody>
//                 <CardTitle tag="h5">{booking.tourName}</CardTitle>
//                 <CardSubtitle tag="h6" className="mb-2 text-muted">
//                   {new Date(booking.bookAt).toLocaleDateString()}
//                 </CardSubtitle>
//                 <CardText>
//                   <p>Guests: {booking.guestSize}</p>
//                   <p>Total Payment: ${booking.totalPayment}</p>
//                   <p>Phone: {booking.phone}</p>
//                 </CardText>
//                 <div className="price-and-rating">
//                   <span className="price">${booking.price} per person</span>
//                   <span className="rating">★ 4.5 (584 reviews)</span>
//                 </div>
//               </CardBody>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//     </Container>
//   );
// };

// export default BookingHistory;

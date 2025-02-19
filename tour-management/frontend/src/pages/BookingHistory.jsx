// import React, { useEffect, useContext, useState } from 'react';
// import { Container, ListGroup, ListGroupItem, Row, Col } from 'reactstrap';
// import { AuthContext } from '../context/AuthContext';
// import { BASE_URL } from '../utils/config';
// import CommonSection from '../shared/CommonSection'
// import BookingCard from '../shared/BookingCard';

// const BookingHistory = () => {
//   const { user } = useContext(AuthContext);
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

//         const res = await fetch(`${BASE_URL}/booking/booking-history/all`, {
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
//     <>
//       <CommonSection title={"Your Booking History"} />
//       <Container className="booking-history">


//         {loading && <p>Loading...</p>}
//         {error && <p className="error-text">{error}</p>}
//         {!loading && bookings.length === 0 && !error && <p>No bookings found.</p>}


//         <Row>
//           {bookings.map((booking) => (
//             <Col lg="3" md="6" sm="12" key={booking._id} className="mb-4">
//               <BookingCard booking={booking} />
//             </Col>
//           ))}
//         </Row>

//       </Container>
//     </>
//   );

// };

// export default BookingHistory;


import React, { useEffect, useContext, useState } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../utils/config';
import CommonSection from '../shared/CommonSection';
import BookingCard from '../shared/BookingCard';

const BookingHistory = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  // Fetch tổng số booking của user để tính số trang
  useEffect(() => {
    const fetchBookingCount = async () => {
      try {
        const res = await fetch(`${BASE_URL}/booking/booking-history/count`, {
          method: 'GET',
          credentials: 'include',
        });

        const result = await res.json();
        if (res.ok) {
          const pages = Math.ceil(result.count / 8); // Giả sử mỗi trang có 8 booking
          setPageCount(pages);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Failed to fetch booking count.");
      }
    };

    if (user) {
      fetchBookingCount();
    }
  }, [user]);

  // Fetch lịch sử booking theo trang
  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        if (!user) {
          setError("Please sign in to view your booking history.");
          setLoading(false);
          return;
        }

        setLoading(true);
        const res = await fetch(`${BASE_URL}/booking/booking-history/all?page=${page}`, {
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
  }, [user, page]);

  return (
    <>
      <CommonSection title={"Your Booking History"} />
      <Container className="booking-history">

        {loading && <p className="text-center pt-5">Loading...</p>}
        {error && <p className="error-text text-center pt-5">{error}</p>}
        {!loading && bookings.length === 0 && !error && <p className="text-center pt-5">No bookings found.</p>}

        <Row>
          {bookings.map((booking) => (
            <Col lg="3" md="6" sm="12" key={booking._id} className="mb-4">
              <BookingCard booking={booking} />
            </Col>
          ))}
        </Row>

        {/* Pagination */}
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

      </Container>
    </>
  );
};

export default BookingHistory;

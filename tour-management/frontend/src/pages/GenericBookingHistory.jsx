import React, { useEffect, useContext, useState } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../utils/config';
import CommonSection from '../shared/CommonSection';
import BookingCard from '../shared/BookingCard'; // nên xử lý hiển thị theo `type` bên trong

const GenericBookingHistory = ({ type, title }) => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            const res = await fetch(`${BASE_URL}/${type}-bookings/booking-history/count`, {
                credentials: 'include',
            });
            const result = await res.json();
            if (res.ok) setPageCount(Math.ceil(result.count / 8));
            else setError(result.message);
        };
        if (user) fetchCount();
    }, [user, type]);

    useEffect(() => {
        const fetchHistory = async () => {
            const res = await fetch(`${BASE_URL}/${type}-bookings/booking-history/all?page=${page}`, {
                credentials: 'include',
            });
            const result = await res.json();
            if (res.ok) setBookings(result.data);
            else setError(result.message);
            setLoading(false);
        };
        fetchHistory();
    }, [user, type, page]);

    return (
        <>
            <CommonSection title={title} />
            <Container>
                {loading && <p className="text-center pt-5">Loading...</p>}
                {error && <p className="text-center pt-5">{error}</p>}
                {!loading && bookings.length === 0 && !error && <p className="text-center pt-5">No bookings found.</p>}
                <Row>
                    {bookings.map((booking) => (
                        <Col lg="3" md="6" sm="12" key={booking._id} className="mb-4">
                            <BookingCard booking={booking} type={type} />
                        </Col>
                    ))}
                </Row>
                <Row>
                    <Col lg="12" className="d-flex justify-content-center mt-4 gap-3">
                        {[...Array(pageCount).keys()].map(num => (
                            <span
                                key={num}
                                onClick={() => setPage(num)}
                                className={page === num ? 'active__page' : ''}
                            >
                                {num + 1}
                            </span>
                        ))}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default GenericBookingHistory;

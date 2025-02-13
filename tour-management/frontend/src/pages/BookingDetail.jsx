import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Button } from "reactstrap";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";
import "../styles/booking-detail.css";

const BookingDetail = () => {
    const { user } = useContext(AuthContext);
    const { bookingId } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookingDetail = async () => {
            try {
                if (!user) {
                    setError("Please sign in to view booking details.");
                    setLoading(false);
                    return;
                }

                const res = await fetch(`${BASE_URL}/booking/${bookingId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${user.token}`,
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                });

                const result = await res.json();

                if (!res.ok) {
                    throw new Error(result.message || "Failed to fetch booking details.");
                }

                setBooking(result.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetail();
    }, [bookingId, user]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error-text">{error}</p>;
    if (!booking) return <p>No booking found.</p>;

    return (
        <Container className="booking-detail">
            <h2>Booking Details</h2>
            <div className="booking-detail__content">
                <div className="booking-detail__image">
                    <img src={booking.tourId?.photo || ""} alt={booking.tourId?.title || "Tour Image"} />
                </div>
                <div className="booking-detail__info">
                    <h3>{booking.tourId?.title}</h3>
                    <p><strong>Price per person:</strong> ${booking.tourId?.price}</p>
                    <p><strong>Date:</strong> {new Date(booking.bookAt).toLocaleDateString()}</p>
                    <p><strong>Guest:</strong> {booking.guestSize} people</p>
                    <p><strong>Total Payment:</strong> ${booking.guestSize * booking.tourId?.price}</p>
                    <p><strong>Booked by:</strong> {booking.fullName} ({booking.userEmail})</p>
                    <p><strong>Contact Number:</strong> {booking.phone}</p>
                    <p><strong>Payment Status:</strong> {booking.paymentStatus || "Pending"}</p>


                    <div className="booking-actions">
                        <Button color="danger">Cancel Booking</Button>
                        <Button color="primary">Download Invoice</Button>
                        <Button color="success">Contact Support</Button>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default BookingDetail;

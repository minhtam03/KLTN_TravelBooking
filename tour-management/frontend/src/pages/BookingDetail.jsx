import React, { useEffect, useContext, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container } from "reactstrap";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";
import "../styles/booking-detail.css";
import { Button } from "@mui/material";

const BookingDetail = () => {
    const { user } = useContext(AuthContext);
    const { bookingId } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const serviceFee = 10

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


    // Xử lý thanh toán lại nếu payment đang ở trạng thái pending
    const handleContinuePayment = async () => {
        if (!booking) return;

        try {
            const totalAmount = booking.guestSize * booking.tourId?.price + serviceFee;

            const paymentData = {
                bookingId: booking._id,
                userId: booking.userId,
                tourName: booking.tourName,
                price: totalAmount,  // Tổng giá trị đơn hàng
            };

            const res = await fetch(`${BASE_URL}/payments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(paymentData),
            });

            const result = await res.json();

            if (!res.ok || !result.session || !result.session.url) {
                return alert("Payment failed. Please try again.");
            }

            // Chuyển hướng đến trang thanh toán của Stripe
            window.location.href = result.session.url;
        } catch (err) {
            console.error("Error:", err);
            alert("Something went wrong while processing the payment.");
        }
    };

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
                    {/* <h3>{booking.tourId?.title}</h3> */}
                    <h3>
                        <Link to={`/tours/${booking.tourId?._id}`} className="tour-link">
                            {booking.tourId?.title}
                        </Link>
                    </h3>
                    <p><strong>Booked by:</strong> {booking.fullName} ({booking.userEmail})</p>
                    <p><strong>Contact Number:</strong> {booking.phone}</p>

                    <p><strong>Tour Date:</strong> {new Date(booking.bookAt).toLocaleDateString()}</p>
                    <p><strong>Booking Date:</strong> {new Date(booking.createdAt).toLocaleDateString()}</p>
                    <p><strong>Price per person:</strong> ${booking.tourId?.price}</p>
                    <p><strong>Guest:</strong> {booking.guestSize} people</p>

                    <p><strong>Total Payment:</strong> ${booking.guestSize * booking.tourId?.price + serviceFee}</p>
                    <p><strong>Payment Status:</strong> {booking.paymentStatus || "Pending"}</p>


                    <div className="booking-actions">
                        <Button variant="outlined" color="primary" onClick={handleContinuePayment}>
                            Cancel Booking
                        </Button>

                        {/* Nếu trạng thái thanh toán là pending thì hiển thị nút thanh toán */}
                        {booking.paymentStatus === "pending" && (
                            <Button variant="contained" color="primary" onClick={handleContinuePayment}>
                                Continue Payment
                            </Button>

                        )}
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default BookingDetail;
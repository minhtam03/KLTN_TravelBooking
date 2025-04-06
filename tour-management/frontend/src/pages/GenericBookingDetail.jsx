import React, { useEffect, useContext, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container } from "reactstrap";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";
import "../styles/booking-detail.css";
import { Button } from "@mui/material";

const GenericBookingDetail = ({ type }) => {
    const { user } = useContext(AuthContext);
    const { bookingId } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const serviceFee = 10;

    useEffect(() => {
        const fetchBookingDetail = async () => {
            try {
                if (!user) {
                    setError("Please sign in to view booking details.");
                    setLoading(false);
                    return;
                }

                const res = await fetch(`${BASE_URL}/${type}-bookings/${bookingId}`, {
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
    }, [bookingId, user, type]);

    const handleContinuePayment = async () => {
        if (!booking) return;

        let unitPrice = 0;
        let quantity = 1;
        let itemName = "";

        if (type === "tour") {
            unitPrice = booking.tourId?.price || 0;
            quantity = booking.guestSize;
            itemName = booking.tourName;
        } else if (type === "hotel") {
            unitPrice = booking.hotelId?.pricePerNight || 0;
            quantity = booking.night;
            itemName = booking.hotelName;
        } else {
            // mở rộng cho flight/others
            unitPrice = booking.price || 0;
            itemName = booking.name;
        }

        const totalAmount = unitPrice * quantity + serviceFee;

        const paymentData = {
            bookingId: booking._id,
            userId: booking.userId,
            name: itemName,
            type,
            price: totalAmount,
        };

        try {
            const res = await fetch(`${BASE_URL}/payments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(paymentData),
            });

            const result = await res.json();

            if (!res.ok || !result.session?.url) {
                return alert("Payment failed. Please try again.");
            }

            window.location.href = result.session.url;
        } catch (err) {
            console.error("Error:", err);
            alert("Something went wrong while processing the payment.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error-text">{error}</p>;
    if (!booking) return <p>No booking found.</p>;

    const item = type === "tour" ? booking.tourId : booking.hotelId;
    const image = item?.photo;
    const name = item?.title || item?.hotelName || "Service";
    const dateLabel = type === "tour" ? "Tour Date" : "Check-in Date";
    const quantityLabel = type === "tour" ? "Guest" : "Nights";
    const quantity = type === "tour" ? booking.guestSize : booking.night;
    const unitPrice = type === "tour" ? item?.price : item?.pricePerNight;
    const totalPrice = unitPrice * quantity + serviceFee;
    const detailLink = type === "tour" ? `/tours/${item?._id}` : `/hotels/${item?._id}`;

    return (
        <Container className="booking-detail">
            <h2>Booking Details</h2>
            <div className="booking-detail__content">
                <div className="booking-detail__image">
                    <img src={image || ""} alt={name} />
                </div>
                <div className="booking-detail__info">
                    <h3>
                        <Link to={detailLink} className="tour-link">
                            {name}
                        </Link>
                    </h3>
                    <p><strong>Booked by:</strong> {booking.fullName} ({booking.userEmail})</p>
                    <p><strong>Contact Number:</strong> {booking.phone}</p>
                    <p><strong>{dateLabel}:</strong> {new Date(booking.bookAt).toLocaleDateString()}</p>
                    <p><strong>Booking Date:</strong> {new Date(booking.createdAt).toLocaleDateString()}</p>
                    <p><strong>Price per unit:</strong> ${unitPrice}</p>
                    <p><strong>{quantityLabel}:</strong> {quantity}</p>
                    <p><strong>Total Payment:</strong> ${totalPrice}</p>
                    <p><strong>Payment Status:</strong> {booking.paymentStatus || "Pending"}</p>

                    <div className="booking-actions">
                        <Button variant="outlined" color="error">
                            Cancel Booking
                        </Button>

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

export default GenericBookingDetail;

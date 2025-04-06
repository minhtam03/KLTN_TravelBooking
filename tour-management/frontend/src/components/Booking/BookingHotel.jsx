import React, { useState, useContext } from 'react';
import './booking-hotel.scss';
import { Form, FormGroup, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/config';

const BookingHotel = ({ hotel }) => {
    const { _id, pricePerNight, hotelName } = hotel;
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [booking, setBooking] = useState({
        userId: user?._id,
        userEmail: user?.email,
        hotelId: _id,
        hotelName,
        fullName: '',
        phone: '',
        night: 1,
        departureDate: '',
    });

    const handleChange = (e) => {
        setBooking((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const serviceFee = 10;
    const totalAmount = Number(pricePerNight) * Number(booking.night) + serviceFee;

    const handleClick = async (e) => {
        e.preventDefault();

        const today = new Date().setHours(0, 0, 0, 0);
        const checkDate = new Date(booking.departureDate).setHours(0, 0, 0, 0);
        if (checkDate < today) {
            return alert("Departure date must be today or later.");
        }

        try {
            if (!user) return alert("Please sign in");

            const res = await fetch(`${BASE_URL}/hotel-bookings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(booking),
            });

            const result = await res.json();
            if (!res.ok) return alert(result.message);

            const bookingId = result?.data?._id;
            if (!bookingId) return alert("Booking failed");

            const paymentData = {
                bookingId,
                userId: booking.userId,
                name: booking.hotelName,   // tên khách sạn
                price: totalAmount,
                type: "hotel",             // quan trọng!
            };

            const resPayment = await fetch(`${BASE_URL}/payments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(paymentData),
            });

            const resultPayment = await resPayment.json();
            if (!resPayment.ok || !resultPayment.session?.url) {
                return alert("Payment failed. Please try again.");
            }

            window.location.href = resultPayment.session.url;
        } catch (err) {
            console.error(err);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="booking">
            <div className="booking__top d-flex align-items-center justify-content-between">
                <h3>${pricePerNight} <span>/night</span></h3>
            </div>

            <div className="booking__form">
                <h5>Booking Information</h5>
                <Form className="booking__info-form">
                    <FormGroup>
                        <input type="text" placeholder="Full Name" id="fullName" required onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <input type="text" placeholder="Phone" id="phone" required onChange={handleChange} />
                    </FormGroup>
                    <FormGroup className="d-flex align-items-center gap-3">
                        <input type="date" id="departureDate" required onChange={handleChange} />
                        <input type="number" placeholder="Nights" id="night" min={1} required onChange={handleChange} />
                    </FormGroup>
                </Form>
            </div>

            <div className="booking__bottom">
                <ListGroup>
                    <ListGroupItem className="border-0 px-0">
                        <h5 className="d-flex align-items-center gap-1">
                            ${pricePerNight} <i className="ri-close-line"></i> {booking.night || 1} night(s)
                        </h5>
                        <span>${pricePerNight * (booking.night || 1)}</span>
                    </ListGroupItem>
                    <ListGroupItem className="border-0 px-0">
                        <h5>Service charge</h5>
                        <span>${serviceFee}</span>
                    </ListGroupItem>
                    <ListGroupItem className="border-0 px-0 total">
                        <h5>Total</h5>
                        <span>${totalAmount}</span>
                    </ListGroupItem>
                </ListGroup>

                <Button className="btn primary__btn w-100 mt-4" onClick={handleClick}>
                    Book Now
                </Button>
            </div>
        </div>
    );
};

export default BookingHotel;

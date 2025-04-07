import React, { useState, useContext } from 'react';
import './booking.scss';
import { Form, FormGroup, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/config';

const BookingForm = ({ item, type, avgRating }) => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [booking, setBooking] = useState({
        userId: user && user._id,
        userEmail: user && user.email,
        fullName: '',
        phone: '',
        bookAt: '',
        guestSize: 1, // tour
        nights: 1,     // hotel
    });

    const handleChange = e => {
        setBooking(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const price = type === 'tour' ? item?.price : item?.pricePerNight;
    const name = type === 'tour' ? item?.title : item?.hotelName;
    const reviews = item?.reviews || [];
    const photo = item?.photo;

    const serviceFee = 10;
    const totalAmount = type === 'tour'
        ? price * Number(booking.guestSize) + serviceFee
        : price * Number(booking.nights) + serviceFee;

    const handleClick = async (e) => {
        e.preventDefault();

        const currentDate = new Date().setHours(0, 0, 0, 0);
        const bookingDate = new Date(booking.bookAt).setHours(0, 0, 0, 0);
        if (bookingDate < currentDate) {
            return alert("Booking date must be today or later.");
        }

        try {
            if (!user) return alert("Please sign in");

            // 1. Gửi thông tin booking
            const bookingData = {
                userId: booking.userId,
                userEmail: booking.userEmail,
                fullName: booking.fullName,
                phone: booking.phone,
                bookAt: booking.bookAt,
            };

            let url = '';
            if (type === 'tour') {
                Object.assign(bookingData, {
                    tourId: item._id,
                    tourName: name,
                    guestSize: booking.guestSize,
                    tourPhoto: photo,
                    tourPrice: price
                });
                url = `${BASE_URL}/booking/tour`;
            } else {
                Object.assign(bookingData, {
                    hotelId: item._id,
                    hotelName: name,
                    nights: booking.nights,
                    hotelPhoto: photo,
                    hotelPrice: price
                });
                url = `${BASE_URL}/booking/hotel`;
            }

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(bookingData)
            });

            const result = await res.json();
            if (!res.ok) return alert(result.message);

            const bookingId = result?.data?._id;
            if (!bookingId) return alert("Booking failed.");

            // 2. Gửi request tạo session thanh toán
            const paymentPayload = {
                bookingId,
                userId: booking.userId,
                price: totalAmount,
                type,
                name,
            };

            const resPayment = await fetch(`${BASE_URL}/payments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(paymentPayload),
            });

            const paymentResult = await resPayment.json();

            if (!resPayment.ok || !paymentResult.session?.url) {
                return alert("Payment failed. Please try again.");
            }

            window.location.href = paymentResult.session.url;

        } catch (err) {
            console.error("Booking Error:", err);
            alert("Something went wrong.");
        }
    };

    return (
        <div className="booking">
            <div className="booking__top d-flex align-items-center justify-content-between">
                <h3>${price} <span>{type === 'tour' ? '/per person' : '/per night'}</span></h3>
                <span className="tour__rating d-flex align-items-center">
                    <i className="ri-star-fill"></i>
                    {avgRating === 0 ? null : avgRating} ({reviews.length})
                </span>
            </div>

            <div className="booking__form">
                <h5>Information</h5>
                <Form className="booking__info-form">
                    <FormGroup>
                        <input type="text" placeholder="Full Name" id="fullName" required onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <input type="text" placeholder="Phone" id="phone" required onChange={handleChange} />
                    </FormGroup>
                    <FormGroup className="d-flex align-items-center gap-3">
                        <input type="date" id="bookAt" required onChange={handleChange} />
                        {type === 'tour' ? (
                            <input type="number" id="guestSize" min={1} placeholder="Guest" required onChange={handleChange} />
                        ) : (
                            <input type="number" id="nights" min={1} placeholder="Nights" required onChange={handleChange} />
                        )}
                    </FormGroup>
                </Form>
            </div>

            <div className="booking__bottom">
                <ListGroup>
                    <ListGroupItem className="border-0 px-0">
                        <h5 className="d-flex align-items-center gap-1">
                            ${price} <i className="ri-close-line"></i> 1 {type === 'tour' ? 'person' : 'night'}
                        </h5>
                        <span>${price}</span>
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

export default BookingForm;

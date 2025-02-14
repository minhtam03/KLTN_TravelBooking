import React, { useState, useContext } from 'react'
import './booking.scss'
import { Form, FormGroup, ListGroup, ListGroupItem, Button } from 'reactstrap'


import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { BASE_URL } from '../../utils/config'

const Booking = ({ tour, avgRating }) => {
    const { _id, price, reviews, title, photo } = tour
    const navigate = useNavigate()

    const { user } = useContext(AuthContext)

    const [booking, setBooking] = useState({
        userId: user && user._id,
        userEmail: user && user.email,
        tourId: tour && tour._id,
        tourName: title,
        fullName: '',
        phone: '',
        guestSize: 1,
        bookAt: '',
        tourPhoto: photo,
        tourPrice: price
    })

    const handleChange = e => {
        setBooking(prev => ({ ...prev, [e.target.id]: e.target.value }))
    }

    const serviceFee = 10
    const totalAmount = Number(price) * Number(booking.guestSize)
        + Number(serviceFee)


    // send data to the server

    const handleClick = async (e) => {
        e.preventDefault();
        const currentDate = new Date().setHours(0, 0, 0, 0);
        const bookingDate = new Date(booking.bookAt).setHours(0, 0, 0, 0);

        if (bookingDate < currentDate) {
            return alert("Booking date must be today or later.");
        }

        try {
            if (!user || user === undefined || user === null) {
                return alert("Please sign in");
            }

            // Gửi dữ liệu đặt tour trước
            const res = await fetch(`${BASE_URL}/booking`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(booking),
            });

            const result = await res.json();

            if (!res.ok) {
                return alert(result.message);
            }

            console.log("Booking response:", result);

            // **LẤY bookingId từ phản hồi API**
            const bookingId = result?.data?._id;

            if (!bookingId) {
                return alert("Failed to create booking.");
            }

            // **Chuẩn bị dữ liệu thanh toán**
            const paymentData = {
                bookingId: bookingId,  // Đã lấy từ response booking
                userId: booking.userId,
                tourName: booking.tourName, // Đảm bảo khớp với backend
                price: totalAmount,  // Đã bao gồm phí dịch vụ
            };

            console.log("Sending payment request:", paymentData);

            const resPayment = await fetch(`${BASE_URL}/payments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(paymentData),
            });

            const resultPayment = await resPayment.json();


            if (!resPayment.ok || !resultPayment.session || !resultPayment.session.url) {
                return alert("Payment failed. Please try again.");
            }

            console.log("Payment response:", resultPayment);

            window.location.href = resultPayment.session.url;

        } catch (err) {
            console.error("Error:", err);
            alert(err.message);
        }
    };



    return (
        <div className='booking'>
            <div className="booking__top d-flex align-items-center
        justify-content-between">
                <h3>${price} <span>/per person</span> </h3>

                <span className='tour__rating d-flex align-items-center'>
                    <i class="ri-star-fill" ></i>
                    {avgRating === 0 ? null : avgRating} ({reviews?.length})
                </span>
            </div>

            {/* Booking form */}
            <div className='booking__form'>
                <h5>Information</h5>
                {/* <Form className="booking__info-form" onSubmit={handleClick}> */}
                <Form className="booking__info-form">
                    <FormGroup>
                        <input type="text" placeholder='Full Name' id='fullName'
                            required onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <input type="number" placeholder='Phone' id='phone'
                            required onChange={handleChange} />
                    </FormGroup>
                    <FormGroup className='d-flex align-items-center gap-3'>
                        <input type="date" placeholder='' id='bookAt'
                            required onChange={handleChange} />
                        <input type="number" placeholder='Guest' id='guestSize'
                            required onChange={handleChange} />
                    </FormGroup>
                </Form>
            </div>

            <div className='booking__bottom'>
                <ListGroup>
                    <ListGroupItem className='border-0 px-0'>
                        <h5 className='d-flex align-items-center gap-1'>
                            ${price}
                            <i class="ri-close-line"></i>
                            1 person
                        </h5>
                        <span> ${price}</span>
                    </ListGroupItem>
                    <ListGroupItem className='border-0 px-0'>
                        <h5>Service charge</h5>
                        <span> ${serviceFee}</span>
                    </ListGroupItem>
                    <ListGroupItem className='border-0 px-0 total'>
                        <h5>Total</h5>
                        <span> ${totalAmount}</span>
                    </ListGroupItem>
                </ListGroup>

                <Button className="btn primary__btn w-100 mt-4" onClick={handleClick}>
                    Book Now
                </Button>
            </div>

        </div>
    )
}

export default Booking
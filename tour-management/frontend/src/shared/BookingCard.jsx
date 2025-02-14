

import React from 'react';
import { Card, CardBody } from 'reactstrap';
import './booking-card.css';
import defaultImg from "../assets/images/tour-img04.jpg"; // Ảnh mặc định
import { useNavigate } from 'react-router-dom';

const BookingCard = ({ booking }) => {
  const { _id, guestSize, bookAt, tourId } = booking;
  const navigate = useNavigate();

  // Lấy thông tin từ `tourId` sau khi populate
  const tourName = tourId?.title || "Unknown Tour";
  const tourPhoto = tourId?.photo || defaultImg;
  const tourPrice = tourId?.price || "Unknown Price";
  const serviceFee = 10

  const handleClick = () => {
    navigate(`/history/${_id}`); // Chuyển đến trang chi tiết booking
  };


  return (
    <div className="booking__card" onClick={handleClick} style={{ cursor: "pointer" }}>
      <Card>
        <div className="booking__img">
          <img src={tourPhoto} alt="Tour Image" />
        </div>
        <CardBody>
          <h5 className="booking__title">{tourName}</h5>
          <div className="booking__details">
            <p><i className="ri-calendar-line"></i> {bookAt ? new Date(bookAt).toLocaleDateString() : "Unknown Date"}</p>
            <p><i className="ri-user-line"></i> Guest: {guestSize} {guestSize > 1 ? "people" : "person"}</p>
            <p><i className="ri-money-dollar-circle-line"></i> Total payment: ${tourPrice * guestSize + serviceFee}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default BookingCard;

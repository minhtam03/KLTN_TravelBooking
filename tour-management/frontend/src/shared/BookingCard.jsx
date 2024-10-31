// BookingCard.js
import React from 'react';
import { Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import './booking-card.css';

const BookingCard = ({ booking }) => {
  const { tourName, fullName, phone, guestSize, bookAt, totalPayment, photo } = booking;

  return (
    <div className="booking__card">
      <Card>
        <div className="booking__img">
          <img src={photo} alt="booking-img" />
        </div>
        <CardBody>
          <h5 className="booking__title">
            {tourName}
          </h5>
          <div className="booking__details">
            <p><i className="ri-calendar-line"></i> {new Date(bookAt).toLocaleDateString()}</p>
            <p>Guest: {guestSize} people</p>
            <p>Total payment: ${totalPayment}</p>
          </div>
          <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
            <span className="booking__price">${35.00} <span> /per person</span></span>
            <span className="booking__rating">
              <i className="ri-star-fill"></i> 4.5 (584 reviews)
            </span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default BookingCard;

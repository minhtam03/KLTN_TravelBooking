// import React from 'react';
// import { Card, CardBody } from 'reactstrap';
// import './booking-card.css';
// import defaultImg from "../assets/images/tour-img04.jpg";
// import { useNavigate } from 'react-router-dom';

// const BookingCard = ({ booking, type }) => {
//   const navigate = useNavigate();

//   // Common fields
//   const { _id, bookAt, createdAt, paymentStatus } = booking;
//   const serviceFee = 10;

//   // Dynamic fields based on type
//   const isTour = type === "tour";

//   const itemId = isTour ? booking.tourId : booking.hotelId;
//   const itemName = isTour ? booking.tourName : booking.hotelName;
//   const photo = itemId?.photo || defaultImg;
//   const unitPrice = isTour ? itemId?.price : itemId?.pricePerNight;
//   const quantity = isTour ? booking.guestSize : booking.nights;
//   const totalPrice = unitPrice * quantity + serviceFee;

//   const dateLabel = isTour ? "Tour Date" : "Check-in";
//   const paymentLabel = isTour ? "Guests" : "Nights";

//   const handleClick = () => {
//     navigate(`/booking/${type}/${_id}`); // Ví dụ: /booking/tour/bookingId
//   };

//   return (
//     <div className="booking__card" onClick={handleClick} style={{ cursor: "pointer" }}>
//       <Card>
//         <div className="booking__img">
//           <img src={photo} alt={`${itemName}`} />
//         </div>
//         <CardBody>
//           <h5 className="booking__title">{itemName || "Unknown"}</h5>
//           <div className="booking__details">
//             <p><i className="ri-calendar-line"></i> {dateLabel}: {bookAt ? new Date(bookAt).toLocaleDateString() : "Unknown Date"}</p>
//             <p><i className="ri-user-line"></i> {paymentLabel}: {quantity}</p>
//             <p><i className="ri-money-dollar-circle-line"></i> Total: ${totalPrice}</p>
//             <p><i className="ri-information-line"></i> Status: {paymentStatus}</p>
//           </div>
//         </CardBody>
//       </Card>
//     </div>
//   );
// };

// export default BookingCard;

import React from 'react';
import { Card, CardBody } from 'reactstrap';
import './booking-card.css';
import defaultImg from "../assets/images/tour-img04.jpg";
import { useNavigate } from 'react-router-dom';

const BookingCard = ({ booking, type }) => {
  const navigate = useNavigate();

  const { _id, createdAt, paymentStatus } = booking;
  const serviceFee = 10;

  let itemId, itemName, photo, unitPrice, quantity, date, dateLabel, qtyLabel;

  if (type === "tour") {
    itemId = booking.tourId;
    itemName = booking.tourName;
    photo = itemId?.photo || defaultImg;
    unitPrice = itemId?.price || 0;
    quantity = booking.guestSize;
    date = booking.bookAt;
    dateLabel = "Tour Date";
    qtyLabel = "Guests";
  } else if (type === "hotel") {
    itemId = booking.hotelId;
    itemName = booking.hotelName;
    photo = itemId?.photo || defaultImg;
    unitPrice = itemId?.pricePerNight || 0;
    quantity = booking.nights;
    date = booking.bookAt;
    dateLabel = "Check-in";
    qtyLabel = "Nights";
  } else if (type === "flight") {
    itemId = booking.flightId;
    itemName = itemId ? `${itemId.airline} - ${itemId.flightNumber}` : "Flight";
    photo = itemId?.photo || defaultImg;
    unitPrice = itemId?.price || 0;
    quantity = booking.guestSize;
    date = itemId?.departureDate; // ✅ lấy từ flight
    dateLabel = "Departure";
    qtyLabel = "Passengers";
  }

  const totalPrice = unitPrice * quantity + serviceFee;

  const handleClick = () => {
    navigate(`/booking/${type}/${_id}`);
  };

  return (
    <div className="booking__card" onClick={handleClick} style={{ cursor: "pointer" }}>
      <Card>
        <div className="booking__img">
          <img src={photo} alt={`${itemName}`} />
        </div>
        <CardBody>
          <h5 className="booking__title">{itemName || "Unknown"}</h5>
          <div className="booking__details">
            <p><i className="ri-calendar-line"></i> {dateLabel}: {date ? new Date(date).toLocaleDateString() : "Unknown Date"}</p>
            <p><i className="ri-user-line"></i> {qtyLabel}: {quantity}</p>
            <p><i className="ri-money-dollar-circle-line"></i> Total: ${totalPrice}</p>
            <p><i className="ri-information-line"></i> Status: {paymentStatus}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default BookingCard;


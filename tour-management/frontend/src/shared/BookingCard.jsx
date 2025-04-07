

// import React from 'react';
// import { Card, CardBody } from 'reactstrap';
// import './booking-card.css';
// import defaultImg from "../assets/images/tour-img04.jpg"; // Ảnh mặc định
// import { useNavigate } from 'react-router-dom';

// const BookingCard = ({ booking }) => {
//   const { _id, guestSize, bookAt, tourId, createdAt, paymentStatus } = booking;
//   const navigate = useNavigate();

//   // Lấy thông tin từ `tourId` sau khi populate
//   const tourName = tourId?.title || "Unknown Tour";
//   const tourPhoto = tourId?.photo || defaultImg;
//   const tourPrice = tourId?.price || "Unknown Price";
//   const serviceFee = 10

//   const handleClick = () => {
//     navigate(`/history/${_id}`); // Chuyển đến trang chi tiết booking
//   };


//   return (
//     <div className="booking__card" onClick={handleClick} style={{ cursor: "pointer" }}>
//       <Card>
//         <div className="booking__img">
//           <img src={tourPhoto} alt="Tour Image" />
//         </div>
//         <CardBody>
//           <h5 className="booking__title">{tourName}</h5>
//           <div className="booking__details">
//             <p><i className="ri-calendar-line"></i> Tour Date: {bookAt ? new Date(bookAt).toLocaleDateString() : "Unknown Date"}</p>
//             <p><i className="ri-money-dollar-circle-line"></i> Total payment: ${tourPrice * guestSize + serviceFee}</p>
//             <p><i className="ri-calendar-line"></i> Payment Status: {paymentStatus}</p>

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

  // Common fields
  const { _id, bookAt, createdAt, paymentStatus } = booking;
  const serviceFee = 10;

  // Dynamic fields based on type
  const isTour = type === "tour";

  const itemId = isTour ? booking.tourId : booking.hotelId;
  const itemName = isTour ? booking.tourName : booking.hotelName;
  const photo = itemId?.photo || defaultImg;
  const unitPrice = isTour ? itemId?.price : itemId?.pricePerNight;
  const quantity = isTour ? booking.guestSize : booking.nights;
  const totalPrice = unitPrice * quantity + serviceFee;

  const dateLabel = isTour ? "Tour Date" : "Check-in";
  const paymentLabel = isTour ? "Guests" : "Nights";

  const handleClick = () => {
    navigate(`/booking/${type}/${_id}`); // Ví dụ: /booking/tour/bookingId
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
            <p><i className="ri-calendar-line"></i> {dateLabel}: {bookAt ? new Date(bookAt).toLocaleDateString() : "Unknown Date"}</p>
            <p><i className="ri-user-line"></i> {paymentLabel}: {quantity}</p>
            <p><i className="ri-money-dollar-circle-line"></i> Total: ${totalPrice}</p>
            <p><i className="ri-information-line"></i> Status: {paymentStatus}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default BookingCard;

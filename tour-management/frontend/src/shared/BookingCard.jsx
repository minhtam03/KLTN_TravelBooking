// // BookingCard.js
// import React from 'react';
// import { Card, CardBody } from 'reactstrap';
// import { Link } from 'react-router-dom';
// import './booking-card.css';
// import gallaryImg from "../assets/images/tour-img04.jpg"

// const BookingCard = ({ booking }) => {
//   const { tourName, fullName, phone, guestSize, bookAt, totalPayment, tourPhoto, tourPrice } = booking;

//   return (
//     <div className="booking__card">
//       <Card>
//         <div className="booking__img">
//           {/* <img src={tourPhoto} alt="booking-img" /> */}

//           <img src={gallaryImg} alt="booking-img" />
//         </div>
//         <CardBody>
//           <h5 className="booking__title">
//             {tourName}
//           </h5>
//           <div className="booking__details">
//             <p><i className="ri-calendar-line"></i> {new Date(bookAt).toLocaleDateString()}</p>
//             <p>Guest: {guestSize} people</p>
//             <p>Total payment: ${tourPrice}</p>
//           </div>
//           <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
//             {/* <span className="booking__price">${35.00} <span> /per person</span></span> */}
//             {/* <span className="booking__rating">
//               <i className="ri-star-fill"></i> 4.5 (584 reviews)
//             </span> */}
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
import defaultImg from "../assets/images/tour-img04.jpg"; // Ảnh mặc định

const BookingCard = ({ booking }) => {
  const { guestSize, bookAt, tourId } = booking;

  // Lấy thông tin từ `tourId` sau khi populate
  const tourName = tourId?.title || "Unknown Tour";
  const tourPhoto = tourId?.photo || defaultImg;
  const tourPrice = tourId?.price || "Unknown Price"

  return (
    <div className="booking__card">
      <Card>
        <div className="booking__img">
          <img src={tourPhoto} alt="Tour Image" />
        </div>
        <CardBody>
          <h5 className="booking__title">{tourName}</h5>
          <div className="booking__details">
            <p><i className="ri-calendar-line"></i> {bookAt ? new Date(bookAt).toLocaleDateString() : "Unknown Date"}</p>
            <p><i className="ri-user-line"></i> Guest: {guestSize} {guestSize > 1 ? "people" : "person"}</p>
            <p><i className="ri-money-dollar-circle-line"></i> Total payment: ${tourPrice}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default BookingCard;

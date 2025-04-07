// import React from 'react'
// import { Link } from "react-router-dom";
// import './search-hotel-item.css'

// const SearchHotelItem = () => {
//     return (
//         <>
//             <div className="searchItem">
//                 <img src="https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG90ZWx8ZW58MHx8MHx8fDA%3D" alt="" className="siImg" />
//                 <div className="siDesc">
//                     <h1 className="siTitle">Hotel Name</h1>
//                     <span className="siDistance">500m from center</span>
//                     <span className="siTaxiOp">Free airport taxi</span>
//                     <span className="siSubtitle">
//                         Studio Apartment with Air conditioning
//                     </span>
//                     <span className="siFeatures">desc</span>
//                     <span className="siCancelOp">Free cancellation </span>
//                     <span className="siCancelOpSubtitle">
//                         You can cancel later, so lock in this great price today!
//                     </span>
//                 </div>
//                 <div className="siDetails">
//                     <div className="siRating">
//                         <span>Excellent</span>
//                         <button>8.9</button>
//                     </div>
//                     <div className="siDetailTexts">
//                         <span className="siPrice">$123</span>
//                         <span className="siTaxOp">Includes taxes and fees</span>
//                         <Link to={`/hotels/single`}>
//                             <button className="siCheckButton">See availability</button>
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }
// export default SearchHotelItem

import React from 'react';
import { Link } from "react-router-dom";
import './search-hotel-item.css';

const SearchHotelItem = ({ hotel }) => {
    return (
        <div className="searchItem">
            <img
                src={hotel.photo}
                alt=""
                className="siImg"
            />
            <div className="siDesc">
                <h1 className="siTitle">{hotel.hotelName}</h1>
                <span className="siTaxiOp">{hotel.location}</span>
                <span className="siSubtitle">
                    Amenities: {hotel.amenities?.join(', ') || "N/A"}
                </span>
                <span className="siCancelOp">Free cancellation</span>
                {/* <span className="siCancelOpSubtitle">
                    You can cancel later, so lock in this great price today!
                </span> */}
            </div>
            <div className="siDetails">
                <div className="siRating">
                    <span>Rating</span>
                    <button>{hotel.stars || 'N/A'}</button>
                </div>
                <div className="siDetailTexts">
                    <span className="siPrice">${hotel.pricePerNight}</span>
                    <span className="siTaxOp">Includes taxes and fees</span>
                    <Link to={`/stays/${hotel._id}`}>
                        <button className="siCheckButton">See availability</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SearchHotelItem;


// import React from 'react';
// import { Card, CardBody } from 'reactstrap';
// import { Link } from 'react-router-dom';
// import defaultImg from "../../assets/images/tour-img04.jpg";
// import calculateAvgRating from '../../utils/avgRating';
// // import './ItemCardTooltip.scss'; // bạn có thể tạo file CSS riêng nếu muốn style thêm

// const ItemCardTooltip = ({ item, type }) => {
//     if (!item) return null;

//     let id, photo, title, price, location, featured, reviews = [];

//     if (type === "tour") {
//         id = item._id;
//         photo = item.photo || defaultImg;
//         title = item.title;
//         location = item.city;
//         price = item.price;
//         featured = item.featured;
//         reviews = item.reviews || [];
//     } else if (type === "hotel") {
//         id = item._id;
//         photo = item.photo || defaultImg;
//         title = item.hotelName;
//         location = item.location;
//         price = item.pricePerNight;
//         featured = item.stars >= 4; // Gợi ý đánh dấu featured nếu 4 sao trở lên
//         reviews = item.reviews || [];
//     } else if (type === "flight") {
//         id = item._id;
//         photo = item.photo || defaultImg;
//         title = `${item.airline} - ${item.flightNumber}`;
//         location = item.arrivalCity;
//         price = item.price;
//         featured = false;
//         reviews = [];
//     }

//     const { totalRating, avgRating } = calculateAvgRating(reviews);

//     let detailLink = `/${type}s/${id}`;

//     if (type === "hotel") {
//         detailLink = `/stays/${id}`; // Đổi đường dẫn khi type là hotel
//     }

//     return (
//         <div className='tour__card'>
//             <Card>
//                 <div className='tour__img'>
//                     <img src={photo} alt="item" />
//                     {featured && <span>Featured</span>}
//                 </div>

//                 <CardBody>
//                     <div className="card__top d-flex align-items-center justify-content-between">
//                         <span className='tour__location d-flex align-items-center gap-1'>
//                             <i className='ri-map-pin-line'></i> {location}
//                         </span>

//                         {type === "tour" && (
//                             <span className='tour__rating d-flex align-items-center gap-1'>
//                                 <i className="ri-star-fill"></i>
//                                 {avgRating === 0 ? null : avgRating}
//                                 {totalRating === 0 ? "Not rated" : (<span>({reviews.length})</span>)}
//                             </span>
//                         )}
//                     </div>

//                     <h5 className='tour__title'>
//                         <Link to={detailLink}>{title}</Link>
//                     </h5>

//                     <div className='card__bottom d-flex align-items-center justify-content-between mt-3'>
//                         <h5>
//                             ${price} <span>{type === 'hotel' ? " /night" : " /per person"}</span>
//                         </h5>

//                         <button className='btn booking__btn'>
//                             <Link to={detailLink}>View</Link>
//                         </button>
//                     </div>
//                 </CardBody>
//             </Card>
//         </div>
//     );
// };

// export default ItemCardTooltip;


// import React from 'react';
// import { Card, CardBody } from 'reactstrap';
// import { Link } from 'react-router-dom';
// import defaultImg from "../../assets/images/tour-img04.jpg";
// import calculateAvgRating from '../../utils/avgRating';
// // import './ItemCardTooltip.css'; // bạn có thể tạo file CSS riêng nếu muốn style thêm

// const ItemCardTooltip = ({ item, type }) => {
//     if (!item) return null;

//     let id, photo, title, price, location, featured, reviews = [];

//     if (type === "tour") {
//         id = item._id;
//         photo = item.photo || defaultImg;
//         title = item.title;
//         location = item.city;
//         price = item.price;
//         featured = item.featured;
//         reviews = item.reviews || [];
//     } else if (type === "hotel") {
//         id = item._id;
//         photo = item.photo || defaultImg;
//         title = item.hotelName;
//         location = item.location;
//         price = item.pricePerNight;
//         featured = item.stars >= 4; // Gợi ý đánh dấu featured nếu 4 sao trở lên
//         reviews = item.reviews || [];
//     } else if (type === "flight") {
//         id = item._id;
//         photo = item.photo || defaultImg;
//         title = `${item.airline} - ${item.flightNumber}`;
//         location = item.arrivalCity;
//         price = item.price;
//         featured = false;
//         reviews = [];
//     }

//     const { totalRating, avgRating } = calculateAvgRating(reviews);

//     let detailLink = `/${type}s/${id}`;

//     if (type === "hotel") {
//         detailLink = `/stays/${id}`; // Đổi đường dẫn khi type là hotel
//     }

//     return (
//         <div className='tour__card'>
//             <Card>
//                 <div className='tour__img'>
//                     <img src={photo} alt="item" />
//                 </div>

//                 <CardBody>
//                     <div className="card__top d-flex align-items-center justify-content-between">
//                         <span className='tour__location d-flex align-items-center gap-1'>
//                             <i className='ri-map-pin-line'></i> {location}
//                         </span>

//                         {type === "tour" && (
//                             <span className='tour__rating d-flex align-items-center gap-1'>
//                                 <i className="ri-star-fill"></i>
//                                 {avgRating === 0 ? null : avgRating}
//                                 {totalRating === 0 ? "Not rated" : (<span>({reviews.length})</span>)}
//                             </span>
//                         )}
//                     </div>

//                     <h5 className='tour__title'>
//                         <a href={detailLink} target="_blank" rel="noopener noreferrer">{title}</a>
//                     </h5>

//                     <div className='card__bottom d-flex align-items-center justify-content-between mt-3'>
//                         <h5>
//                             ${price} <span>{type === 'hotel' ? " /night" : " /per person"}</span>
//                         </h5>

//                         <button className='btn booking__btn'>
//                             <a href={detailLink} target="_blank" rel="noopener noreferrer">View</a>
//                         </button>
//                     </div>
//                 </CardBody>
//             </Card>
//         </div>
//     );
// };

// export default ItemCardTooltip;


import React from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    Button
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import defaultImg from "../../assets/images/tour-img04.jpg";
import calculateAvgRating from '../../utils/avgRating';
import { Link } from 'react-router-dom';

const ItemCardTooltip = ({ item, type }) => {
    if (!item) return null;

    let id, photo, title, price, location, featured, reviews, locationTo, avgRating = [];

    if (type === "tour") {
        id = item._id;
        photo = item.photo || defaultImg;
        title = item.title;
        location = item.city;
        price = item.price;
        featured = item.featured;
        avgRating = item.avgRating || 0;
        // reviews = item.reviews || [];
    } else if (type === "hotel") {
        id = item._id;
        photo = item.photo || defaultImg;
        title = item.hotelName;
        location = item.location;
        price = item.pricePerNight;
        featured = item.stars >= 4;
        reviews = item.reviews || [];
    } else if (type === "flight") {
        id = item._id;
        photo = item.photo || defaultImg;
        title = `${item.airline} - ${item.flightNumber}`;
        location = item.fromPlace;
        locationTo = item.toPlace;
        price = item.totalPriceUSD;
        featured = false;
        reviews = [];
    }

    // const { totalRating, avgRating } = calculateAvgRating(reviews);

    let detailLink = `/${type}s/${id}`;
    if (type === "hotel") detailLink = `/stays/${id}`;

    return (
        <Card sx={{ maxWidth: 345, borderRadius: 2, boxShadow: 3 }}>
            <CardMedia
                component="img"
                height="200"
                image={photo}
                alt="item"
                sx={{ objectFit: "cover" }}
            />

            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
                        <LocationOnIcon fontSize="small" />
                        <Typography variant="body2"> {type === "flight" ? `${location} → ${locationTo}` : location}</Typography>
                    </Box>

                    {type === "tour" && (
                        <Box display="flex" alignItems="center" gap={0.5} color="warning.main">
                            <StarIcon fontSize="small" />
                            <Typography variant="body2">
                                {avgRating === 0 ? 'Not rated' : `${avgRating}`}
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Typography variant="h6" fontWeight={600} gutterBottom>
                    <a href={detailLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                        {title}
                    </a>
                </Typography>

                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Typography variant="subtitle1" fontWeight={500}>
                        ${price} <Typography variant="caption" component="span">
                            {type === 'hotel' ? " / night" : " / person"}
                        </Typography>
                    </Typography>

                    <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        component="a"
                        href={detailLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ textTransform: "none", fontWeight: 500 }}
                    >
                        View
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ItemCardTooltip;


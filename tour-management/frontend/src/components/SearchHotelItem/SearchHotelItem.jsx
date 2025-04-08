// import React from 'react';
// import { Link } from "react-router-dom";
// import './search-hotel-item.css';

// const SearchHotelItem = ({ hotel }) => {
//     return (
//         <div className="searchItem">
//             <img
//                 src={hotel.photo}
//                 alt=""
//                 className="siImg"
//             />
//             <div className="siDesc">
//                 <h1 className="siTitle">{hotel.hotelName}</h1>
//                 <span className="siTaxiOp">{hotel.location}</span>
//                 <span className="siSubtitle">
//                     Amenities: {hotel.amenities?.join(', ') || "N/A"}
//                 </span>
//                 <span className="siCancelOp">Free cancellation</span>
//                 {/* <span className="siCancelOpSubtitle">
//                     You can cancel later, so lock in this great price today!
//                 </span> */}
//             </div>
//             <div className="siDetails">
//                 <div className="siRating">
//                     <span>Rating</span>
//                     <button>{hotel.stars || 'N/A'}</button>
//                 </div>
//                 <div className="siDetailTexts">
//                     <span className="siPrice">${hotel.pricePerNight}</span>
//                     <span className="siTaxOp">Includes taxes and fees</span>
//                     <Link to={`/stays/${hotel._id}`}>
//                         <button className="siCheckButton">See availability</button>
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SearchHotelItem;

import React from 'react';
import { Link } from 'react-router-dom';
import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Grid,
    Typography,
    Button,
    Box,
    Chip,
    Rating
} from '@mui/material';

const SearchHotelItem = ({ hotel }) => {
    return (
        <Card sx={{ display: 'flex', p: 2, borderRadius: 3, boxShadow: 3, mb: 4 }}>
            {/* Hình ảnh */}
            <CardMedia
                component="img"
                image={hotel.photo}
                alt={hotel.hotelName}
                sx={{ width: 200, height: 200, borderRadius: 2, objectFit: 'cover' }}
            />

            {/* Nội dung */}
            <Grid container spacing={2} sx={{ ml: 2 }}>
                <Grid item xs={12} md={8}>
                    <CardContent sx={{ paddingBottom: 0 }}>
                        <Typography variant="h6" color="primary">
                            {hotel.hotelName}
                        </Typography>

                        <Box mt={1}>
                            <Chip label={hotel.location} color="success" size="small" />
                        </Box>

                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Amenities: {hotel.amenities?.join(', ') || 'N/A'}
                        </Typography>

                        <Typography variant="body2" color="success.main" sx={{ mt: 1, fontWeight: 500 }}>
                            Free cancellation
                        </Typography>
                    </CardContent>
                </Grid>

                {/* Giá và đánh giá */}
                <Grid item xs={12} md={4} sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Star
                        </Typography>
                        <Rating value={Number(hotel.stars) || 0} precision={0.5} readOnly size="small" />
                    </Box>

                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" fontWeight={600}>
                            ${hotel.pricePerNight}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Includes taxes and fees
                        </Typography>
                    </Box>

                    <CardActions sx={{ justifyContent: 'flex-end', p: 0, mt: 1 }}>
                        <Button
                            variant="contained"
                            component={Link}
                            to={`/stays/${hotel._id}`}
                            sx={{
                                borderRadius: 2,
                                backgroundColor: "#7bbcb0",
                                color: "#ffffff",
                                '&:hover': {
                                    backgroundColor: "#69afa3",
                                    color: "#ffffff"
                                }
                            }}
                        >
                            See availability
                        </Button>
                    </CardActions>
                </Grid>
            </Grid>
        </Card>
    );
};

export default SearchHotelItem;



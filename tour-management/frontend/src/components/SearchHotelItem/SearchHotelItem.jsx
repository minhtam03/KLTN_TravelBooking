// import React from 'react';
// import { Link } from 'react-router-dom';
// import {
//     Card,
//     CardMedia,
//     CardContent,
//     CardActions,
//     Grid,
//     Typography,
//     Button,
//     Box,
//     Chip,
//     Rating
// } from '@mui/material';

// const SearchHotelItem = ({ hotel }) => {
//     return (
//         <Card sx={{ display: 'flex', p: 2, borderRadius: 3, boxShadow: 3, mb: 4 }}>
//             {/* Hình ảnh */}
//             <CardMedia
//                 component="img"
//                 image={hotel.photo}
//                 alt={hotel.hotelName}
//                 sx={{ width: 200, height: 200, borderRadius: 2, objectFit: 'cover' }}
//             />

//             {/* Nội dung */}
//             <Grid container spacing={2} sx={{ ml: 2 }}>
//                 <Grid item xs={12} md={8}>
//                     <CardContent sx={{ paddingBottom: 0 }}>
//                         <Typography variant="h6" color="primary">
//                             {hotel.hotelName}
//                         </Typography>

//                         <Box mt={1}>
//                             <Chip label={hotel.location} color="success" size="small" />
//                         </Box>

//                         <Typography variant="body2" sx={{ mt: 1 }}>
//                             Amenities: {hotel.amenities?.join(', ') || 'N/A'}
//                         </Typography>

//                         <Typography variant="body2" color="success.main" sx={{ mt: 1, fontWeight: 500 }}>
//                             Free cancellation
//                         </Typography>
//                     </CardContent>
//                 </Grid>

//                 {/* Giá và đánh giá */}
//                 <Grid item xs={12} md={4} sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
//                     <Box sx={{ textAlign: 'right' }}>
//                         <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                             Star
//                         </Typography>
//                         <Rating value={Number(hotel.stars) || 0} precision={0.5} readOnly size="small" />
//                     </Box>

//                     <Box sx={{ mt: 2 }}>
//                         <Typography variant="h6" fontWeight={600}>
//                             ${hotel.pricePerNight}
//                         </Typography>
//                         <Typography variant="caption" color="text.secondary">
//                             Includes taxes and fees
//                         </Typography>
//                     </Box>

//                     <CardActions sx={{ justifyContent: 'flex-end', p: 0, mt: 1 }}>
//                         <Button
//                             variant="contained"
//                             component={Link}
//                             to={`/stays/${hotel._id}`}
//                             sx={{
//                                 borderRadius: 2,
//                                 backgroundColor: "#7bbcb0",
//                                 color: "#ffffff",
//                                 '&:hover': {
//                                     backgroundColor: "#69afa3",
//                                     color: "#ffffff"
//                                 }
//                             }}
//                         >
//                             See availability
//                         </Button>
//                     </CardActions>
//                 </Grid>
//             </Grid>
//         </Card>
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
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import StorefrontIcon from '@mui/icons-material/Storefront';
import BedIcon from '@mui/icons-material/Bed';
import hotelImgDefault from '../../assets/images/hotel.jpg'

const SearchHotelItem = ({ hotel }) => {
    return (
        <Card
            sx={{
                display: 'flex',
                p: 2,
                borderRadius: 3,
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                mb: 4,
                fontFamily: 'Mulish, sans-serif',
                bgcolor: '#fdfdfd'
            }}
        >
            {/* Hình ảnh khách sạn */}
            <CardMedia
                component="img"
                image={hotel.photo && hotel.photo.trim() !== "" ? hotel.photo : hotelImgDefault}
                alt={hotel.hotelName}
                sx={{
                    width: 200,
                    height: 200,
                    borderRadius: 2,
                    objectFit: 'cover',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
                }}
            />

            {/* Nội dung chính */}
            <Grid container spacing={2} sx={{ ml: 2 }}>
                {/* Thông tin bên trái */}
                <Grid item xs={12} md={8}>
                    <CardContent sx={{ pb: 1 }}>
                        <Typography variant="subtitle1"
                            fontWeight={700}
                            sx={{
                                fontSize: '1.4rem',
                                mb: 1,
                                fontFamily: 'Mulish, sans-serif',
                                '& a': {
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    '&:hover': { color: 'var(--secondary-color)' },
                                },
                            }}>

                            <Link to={`/stays/${hotel._id}`}>{hotel.hotelName}</Link>
                        </Typography>

                        {/* <Box mt={1}>
                            <Chip
                                label={hotel.location}
                                color="success"
                                size="small"
                                sx={{ fontWeight: 500, fontFamily: 'Mulish' }}
                            />
                        </Box> */}
                        <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                            <FmdGoodIcon sx={{ fontSize: 22, fill: 'rgb(125,125,125)' }} />
                            <Typography variant="body2" fontFamily="Mulish, sans-serif" fontWeight={500}>
                                {hotel.location}
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={1} mb={1.5}
                            sx={{
                                borderBottom: '1px solid #ccc', // ✅ Thêm border dưới
                                pb: 2 // ✅ padding-bottom để tạo khoảng cách giữa chữ và viền
                            }}>
                            <StorefrontIcon sx={{ fontSize: 22, color: 'text.secondary' }} />
                            <Typography variant="body2" fontFamily="Mulish, sans-serif">
                                Amenities: {hotel.amenities?.join(', ') || 'N/A'}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                            <BedIcon sx={{ fontSize: 22, fill: 'rgb(125,125,125)' }} />
                            <Typography variant="body2" fontFamily="Mulish, sans-serif" fontWeight={500}>
                                Rooms available: {hotel.roomsAvailable}
                            </Typography>
                        </Box>
                    </CardContent>
                </Grid>

                {/* Giá và đánh giá */}
                <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                        textAlign: { xs: 'left', md: 'right' },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', md: 'flex-end' }
                    }}
                >
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#888' }}>
                            Star
                        </Typography>
                        <Rating
                            value={Number(hotel.stars) || 0}
                            precision={0.5}
                            readOnly
                            size="small"
                            sx={{ mt: 0.5 }}
                        />
                    </Box>

                    <Box mt={2}>
                        <Typography variant="h6" fontWeight={700} color="#1C2B38">
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
                                backgroundColor: '#7bbcb0',
                                color: '#fff',
                                fontWeight: 600,
                                fontFamily: 'Mulish',
                                '&:hover': {
                                    backgroundColor: '#69afa3',
                                    color: '#fff'
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




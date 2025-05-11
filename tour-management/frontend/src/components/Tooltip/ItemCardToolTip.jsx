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
import defaultImg from "../../assets/images/home/home1.jpg";
import defaultFlight from "../../assets/images/flight_img.jpg"
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
        photo = item.photo || defaultFlight;
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
        <Card sx={{ width: 250, borderRadius: 2, boxShadow: 3 }}>
            <CardMedia
                component="img"
                height="200"
                image={photo}
                alt="item"
                sx={{ objectFit: "cover" }}
            />
            {/* <CardMedia
                component="img"
                height="200"
                image={photo}
                alt="item"
                sx={{ objectFit: "cover", width: '100%', height: 200 }}
            /> */}

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
                        sx={{
                            textTransform: "none",
                            '&:hover': {
                                color: "white", // giữ màu không đổi khi hover
                            },
                            fontWeight: 500
                        }}
                    >
                        View
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ItemCardTooltip;

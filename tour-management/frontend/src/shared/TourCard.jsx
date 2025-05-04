import React from 'react';
import { Link } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import RoomIcon from '@mui/icons-material/Room';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import calculateAvgRating from '../utils/avgRating';
import home1 from "../assets/images/home/home1.jpg";

const TourCard = ({ tour }) => {
    const { _id, title, city, photo, price, featured, reviews, duration } = tour;
    const { totalRating, avgRating } = calculateAvgRating(reviews);

    return (
        <Card
            data-testid="tour-card"
            elevation={4}
            sx={{
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
                fontFamily: 'Mulish, sans-serif'
            }}
        >
            {/* Ảnh tour */}
            <Box sx={{ height: 180, position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="180"
                    image={photo || home1}
                    alt="tour-img"
                    sx={{ objectFit: 'cover' }}
                />
                {featured && (
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            background: '#cc484b',
                            color: '#fff',
                            px: 1,
                            py: 0.5,
                            borderRadius: '3px 0 0 0',
                            fontSize: '0.8rem',
                            zIndex: 10,
                            fontFamily: 'Mulish, sans-serif'
                        }}
                    >
                        Featured
                    </Box>
                )}
            </Box>

            {/* Nội dung tour */}
            <CardContent sx={{ fontFamily: 'Mulish, sans-serif' }}>
                {/* Tên tour */}
                <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{
                        fontSize: '1.2rem',
                        height: '3.6em',
                        mb: 1,
                        fontFamily: 'Mulish, sans-serif',
                        '& a': {
                            textDecoration: 'none',
                            color: 'inherit',
                            '&:hover': { color: 'var(--secondary-color)' },
                        },
                    }}
                >
                    <Link to={`/tours/${_id}`} data-testid="tour-title">{title}</Link>
                </Typography>

                {/* Location */}
                <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                    <FmdGoodIcon sx={{ fontSize: 22, fill: 'rgb(125,125,125)' }} />
                    <Typography variant="body2" fontFamily="Mulish, sans-serif" fontWeight={500}>
                        {city}
                    </Typography>
                </Box>

                {/* Duration */}
                <Box display="flex" alignItems="center" gap={1} mb={1.5}
                    sx={{
                        borderBottom: '1px solid #ccc', // ✅ Thêm border dưới
                        pb: 2 // ✅ padding-bottom để tạo khoảng cách giữa chữ và viền
                    }}>
                    <AccessTimeIcon sx={{ fontSize: 22, color: 'text.secondary' }} />
                    <Typography variant="body2" fontFamily="Mulish, sans-serif">
                        {duration || 'Duration unknown'} day(s)
                    </Typography>
                </Box>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={2}

                >
                    {/* Cột bên trái */}
                    <Box>
                        <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                            <StarIcon sx={{ fontSize: 18, color: 'var(--secondary-color)' }} />
                            <Typography variant="body2" fontFamily="Mulish, sans-serif">
                                {avgRating || '0.0'}
                            </Typography>
                        </Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            fontFamily="Mulish, sans-serif"
                        >
                            ({reviews?.length || 0} reviews)
                        </Typography>
                    </Box>

                    {/* Cột bên phải */}
                    <Box textAlign="right">
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                color: 'var(--secondary-color)',
                                fontFamily: 'Mulish, sans-serif',
                            }}
                        >
                            ${price.toFixed(2)}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            fontFamily="Mulish, sans-serif"
                        >
                            per person
                        </Typography>
                    </Box>
                </Box>


            </CardContent>
        </Card>
    );
};

export default TourCard;

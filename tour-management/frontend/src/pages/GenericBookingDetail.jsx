import React, { useEffect, useContext, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";
import {
    Container,
    Grid,
    Typography,
    Button,
    Box,
    Stack,
    Divider,
} from "@mui/material";
import defaultImg from "../assets/images/tour-img04.jpg";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CommonSection from "../shared/CommonSection";

import vietnamAirlinesLogo from '../assets/images/vnairline.jpg';
import vietjetLogo from '../assets/images/vietjet.jpg';
import bambooLogo from '../assets/images/bamboo.jpg';


const getAirlineLogo = (airline) => {
    switch (airline) {
        case 'VietnamAirlines':
            return vietnamAirlinesLogo;
        case 'VietJetAir':
            return vietjetLogo;
        case 'BambooAirways':
            return bambooLogo;
        default:
            return 'https://www.libertytravel.com/sites/default/files/styles/full_size/public/flight-hero.jpg?itok=LKyRwKDq';
    }
};

const GenericBookingDetail = ({ type }) => {
    const { user } = useContext(AuthContext);
    const { bookingId } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const serviceFee = 0;

    useEffect(() => {
        const fetchBookingDetail = async () => {
            try {
                if (!user) {
                    setError("Please sign in to view booking details.");
                    setLoading(false);
                    return;
                }

                const res = await fetch(`${BASE_URL}/booking/${type}/${bookingId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                const result = await res.json();
                if (!res.ok) throw new Error(result.message || "Failed to fetch booking details.");
                setBooking(result.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetail();
    }, [bookingId, user, type]);

    const handleContinuePayment = async () => {
        if (!booking) return;

        let unitPrice = 0, quantity = 1, itemName = "";
        if (type === "tour") {
            unitPrice = booking.tourId?.price || 0;
            quantity = booking.guestSize;
            itemName = booking.tourName;
        } else if (type === "hotel") {
            unitPrice = booking.hotelId?.pricePerNight || 0;
            quantity = booking.nights;
            itemName = booking.hotelName;
        } else if (type === "flight") {
            unitPrice = booking.flightId?.totalPriceUSD || 0;
            quantity = booking.guestSize;
            itemName = `${booking.flightId?.airline} - ${booking.flightId?.flightNumber}`;
        }

        const totalAmount = unitPrice * quantity + serviceFee;

        const paymentData = {
            bookingId: booking._id,
            userId: booking.userId,
            name: itemName,
            type,
            price: totalAmount,
        };

        try {
            const res = await fetch(`${BASE_URL}/payments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(paymentData),
            });

            const result = await res.json();
            if (!res.ok || !result.session?.url) {
                return alert("Payment failed. Please try again.");
            }

            window.location.href = result.session.url;
        } catch (err) {
            console.error("Error:", err);
            alert("Something went wrong while processing the payment.");
        }
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!booking) return <Typography>No booking found.</Typography>;

    let item = null, image = "", name = "", quantity = 1, unitPrice = 0;
    let quantityLabel = "", dateLabel = "", date = "", detailLink = "";

    if (type === "tour") {
        item = booking.tourId;
        image = item?.photo || defaultImg;
        name = booking.tourName;
        quantity = booking.guestSize;
        unitPrice = item?.price || 0;
        quantityLabel = "Guest";
        dateLabel = "Tour Date";
        date = booking.bookAt;
        detailLink = `/tours/${item?._id}`;
    } else if (type === "hotel") {
        item = booking.hotelId;
        image = item?.photo || defaultImg;
        name = booking.hotelName;
        quantity = booking.nights;
        unitPrice = item?.pricePerNight || 0;
        quantityLabel = "Nights";
        dateLabel = "Check-in";
        date = booking.bookAt;
        detailLink = `/stays/${item?._id}`;
    } else if (type === "flight") {
        item = booking.flightId;
        image = getAirlineLogo(item.airline)
        name = `${item?.airline} - ${item?.flightNumber}`;
        quantity = booking.guestSize;
        unitPrice = item?.totalPriceUSD || 0;
        quantityLabel = "Passengers";
        dateLabel = "Departure";
        date = item?.departureDate;
        detailLink = `/flights/${item?._id}`;
    }

    const totalPrice = unitPrice * quantity + serviceFee;

    return (
        <>
            <CommonSection title="Booking Information" />
            <Container sx={{ mt: 5, mb: 5 }}>
                {/* <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: '#1C2B38', fontFamily: 'Volkhov, Georgia, serif' }}
                    gutterBottom

                >
                    <Link to={detailLink} style={{ textDecoration: "none", color: "inherit" }}>
                        {name}
                    </Link>
                </Typography> */}
                <Typography
                    component={Link}
                    to={detailLink}
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: '#1C2B38',
                        fontFamily: 'Volkhov, Georgia, serif',
                        textDecoration: 'none',
                        lineHeight: 1.2, // hoặc 1.1 để đẹp hơn
                        display: 'inline-block',
                        marginBottom: 4, // tự set margin-bottom nếu cần khoảng cách
                        '&:hover': {
                            textDecoration: 'none',
                            color: "black"
                        },
                    }}
                >
                    {name}
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={7}>
                        <Box sx={{ mb: 2 }}>

                        </Box>
                        <Box sx={{ borderRadius: 2, overflow: "hidden" }}>
                            <img
                                src={image}
                                alt={name}
                                style={{ width: "100%", maxHeight: "370px", objectFit: "cover", borderRadius: 12 }}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={5}>
                        <Box sx={{ borderBottom: '1px solid #ccc', pb: 2, mb: 2, mt: 2 }}>
                            {/* <Typography variant="h6" fontWeight={700} mb={1}>
                                Booking Information
                            </Typography> */}
                            <Grid container spacing={2}>
                                <Grid item xs={4} display="flex" alignItems="center">
                                    <PersonOutlineIcon sx={{ color: 'grey.700', mr: 1 }} />
                                    <Typography fontWeight={500}>Full Name</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography>{booking.fullName}</Typography>
                                </Grid>

                                <Grid item xs={4} display="flex" alignItems="center">
                                    <EmailOutlinedIcon sx={{ color: 'grey.700', mr: 1 }} />
                                    <Typography fontWeight={500}>Email</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography>{booking.userEmail}</Typography>
                                </Grid>

                                <Grid item xs={4} display="flex" alignItems="center">
                                    <SmartphoneOutlinedIcon sx={{ color: 'grey.700', mr: 1 }} />
                                    <Typography fontWeight={500}>Phone</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography>{booking.phone}</Typography>
                                </Grid>

                                {date && (
                                    <>
                                        <Grid item xs={4} display="flex" alignItems="center">
                                            <CalendarTodayIcon sx={{ color: 'grey.700', mr: 1 }} />
                                            <Typography fontWeight={500}>{dateLabel}</Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Typography>{new Date(date).toLocaleDateString()}</Typography>
                                        </Grid>
                                    </>
                                )}

                                <Grid item xs={4} display="flex" alignItems="center">
                                    <CalendarTodayIcon sx={{ color: 'grey.700', mr: 1 }} />
                                    <Typography fontWeight={500}>Booking Date</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography>{new Date(booking.createdAt).toLocaleDateString()}</Typography>
                                </Grid>

                                <Grid item xs={4} display="flex" alignItems="center">
                                    <PaidOutlinedIcon sx={{ color: 'grey.700', mr: 1 }} />
                                    <Typography fontWeight={500}>Unit Price</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography>${unitPrice}</Typography>
                                </Grid>

                                <Grid item xs={4} display="flex" alignItems="center">
                                    <PersonOutlineIcon sx={{ color: 'grey.700', mr: 1 }} />
                                    <Typography fontWeight={500}>{quantityLabel}</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography>{quantity}</Typography>
                                </Grid>

                                <Grid item xs={4} display="flex" alignItems="center">
                                    <PaidOutlinedIcon sx={{ color: 'grey.700', mr: 1 }} />
                                    <Typography fontWeight={500}>Total</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography>${totalPrice}</Typography>
                                </Grid>

                                <Grid item xs={4} display="flex" alignItems="center">
                                    <InfoOutlinedIcon sx={{ color: 'grey.700', mr: 1 }} />
                                    <Typography fontWeight={500}>Status</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography>{booking.paymentStatus || "Pending"}</Typography>
                                </Grid>
                            </Grid>

                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, width: "100%", mt: 3 }}>
                            {booking.paymentStatus === "pending" && (
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: 'var(--secondary-color)',
                                        '&:hover': { backgroundColor: '#71aea3' }
                                    }}
                                    onClick={handleContinuePayment}
                                >
                                    Continue Payment
                                </Button>
                            )}

                            {booking.paymentStatus === "paid" && (
                                <Box
                                    component="img"
                                    src="https://cdn.pixabay.com/photo/2020/04/10/13/23/paid-5025785_1280.png" // <-- thay bằng URL phù hợp, ví dụ: require hoặc import
                                    alt="Paid"
                                    sx={{ height: 80, objectFit: 'contain' }}
                                />
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default GenericBookingDetail;

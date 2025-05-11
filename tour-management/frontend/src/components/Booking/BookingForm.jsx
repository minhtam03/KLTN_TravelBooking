import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/config';
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    Divider,
    List,
    ListItem,
    Button,
    Stack,
    Paper,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { Snackbar, Alert, Slide } from '@mui/material';
const BookingForm = ({ item, type, avgRating }) => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [booking, setBooking] = useState({
        userId: user && user._id,
        userEmail: user && user.email,
        fullName: '',
        phone: '',
        bookAt: '',
        guestSize: 1,
        nights: 1,
    });

    const handleChange = (e) => {
        setBooking((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const price = type === 'tour' ? item?.price : item?.pricePerNight;
    const name = type === 'tour' ? item?.title : item?.hotelName;
    const photo = item?.photo;
    const serviceFee = 0;
    const totalAmount = type === 'tour'
        ? price * Number(booking.guestSize) + serviceFee
        : price * Number(booking.nights) + serviceFee;

    const handleClick = async (e) => {
        e.preventDefault();

        const phoneRegex = /^[0-9]{9,15}$/;
        if (!phoneRegex.test(booking.phone)) {
            showSnackbar("Please enter a valid phone number.", "warning");
            return;
        }

        const currentDate = new Date().setHours(0, 0, 0, 0);
        const bookingDate = new Date(booking.bookAt).setHours(0, 0, 0, 0);
        if (bookingDate < currentDate) {
            showSnackbar("Booking date must be today or later.", "warning");
            return;
        }
        if (!user) {
            showSnackbar('Please sign in first.', 'warning');
            return;
        }

        try {
            const bookingData = {
                userId: booking.userId,
                userEmail: booking.userEmail,
                fullName: booking.fullName,
                phone: booking.phone,
                bookAt: booking.bookAt,
            };

            let url = '';
            if (type === 'tour') {
                Object.assign(bookingData, {
                    tourId: item._id,
                    tourName: name,
                    guestSize: booking.guestSize,
                    tourPhoto: photo,
                    tourPrice: price,
                });
                url = `${BASE_URL}/booking/tour`;
            } else {
                Object.assign(bookingData, {
                    hotelId: item._id,
                    hotelName: name,
                    nights: booking.nights,
                    hotelPhoto: photo,
                    hotelPrice: price,
                });
                url = `${BASE_URL}/booking/hotel`;
            }

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(bookingData),
            });

            const result = await res.json();
            if (!res.ok) return alert(result.message);
            const bookingId = result?.data?._id;
            if (!bookingId) return alert("Booking failed.");

            const resPayment = await fetch(`${BASE_URL}/payments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ bookingId, userId: booking.userId, price: totalAmount, type, name }),
            });

            const paymentResult = await resPayment.json();
            if (!resPayment.ok || !paymentResult.session?.url) return alert("Payment failed. Please try again.");

            window.location.href = paymentResult.session.url;
        } catch (err) {
            console.error("Booking Error:", err);
            alert("Something went wrong.");
        }
    };

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

    // const showSnackbar = (message, severity = 'error') => {
    //     setSnackbar({ open: true, message, severity });
    // };
    const showSnackbar = (message, severity = 'error') => {
        setSnackbar(prev => ({ ...prev, open: false }));

        setTimeout(() => {
            setSnackbar({ open: true, message, severity });
        }, 100); // delay nhỏ để đảm bảo trạng thái được cập nhật
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const slideTransition = (props) => <Slide {...props} direction="down" />;

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 80, fontFamily: 'Mulish' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" fontWeight={700} sx={{ fontFamily: 'Mulish' }}>
                    ${price} <Typography variant="body1" component="span" sx={{ fontFamily: 'Mulish' }}>{type === 'tour' ? '/per person' : '/per night'}</Typography>
                </Typography>
                {(type === 'tour' || type === 'hotel') && avgRating > 0 && (
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <StarIcon sx={{ color: 'gold' }} />
                        <Typography variant="body2" sx={{ fontFamily: 'Mulish' }}>{avgRating}</Typography>
                    </Stack>
                )}
            </Stack>

            <Box mb={4}>
                <Typography variant="h6" mt={5} mb={2} fontWeight={700} sx={{ fontFamily: 'Mulish' }}>Information</Typography>
                <Stack spacing={5}>
                    <TextField variant="standard" id="fullName" label="Full Name" fullWidth onChange={handleChange} sx={{ fontFamily: 'Mulish' }} InputProps={{ style: { fontFamily: 'Mulish' } }} />
                    <TextField variant="standard" id="phone" label="Phone" fullWidth onChange={handleChange} sx={{ fontFamily: 'Mulish' }} InputProps={{ style: { fontFamily: 'Mulish' } }} />
                    <Stack direction="row" spacing={5}>
                        <TextField variant="standard" id="bookAt" label="Date" type="date" InputLabelProps={{ shrink: true }} fullWidth onChange={handleChange} sx={{ fontFamily: 'Mulish' }} InputProps={{ style: { fontFamily: 'Mulish' } }} />
                        {type === 'tour' ? (
                            <TextField variant="standard" inputProps={{ min: 1 }} id="guestSize" label="Guest" type="number" fullWidth onChange={handleChange} sx={{ fontFamily: 'Mulish' }} InputProps={{ style: { fontFamily: 'Mulish' } }} />
                        ) : (
                            <TextField variant="standard" inputProps={{ min: 1 }} id="nights" label="Nights" type="number" fullWidth onChange={handleChange} sx={{ fontFamily: 'Mulish' }} InputProps={{ style: { fontFamily: 'Mulish' } }} />
                        )}
                    </Stack>
                </Stack>
            </Box>



            <List disablePadding>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Mulish' }}>
                    <Typography sx={{ fontFamily: 'Mulish' }}>${price} x {type === 'tour' ? booking.guestSize : booking.nights} {type === 'tour' ? 'person' : 'night'} (s)</Typography>
                    <Typography sx={{ fontFamily: 'Mulish' }}>${type === 'tour' ? price * Number(booking.guestSize) : price * Number(booking.nights)}</Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontFamily: 'Mulish' }}>
                    <Typography sx={{ fontFamily: 'Mulish', fontWeight: 'bold' }}>Total</Typography>
                    <Typography sx={{ fontFamily: 'Mulish', fontWeight: 'bold' }}>${totalAmount}</Typography>
                </ListItem>
            </List>

            {/* <Button variant="contained"
                fullWidth
                disabled={item.roomsAvailable === 0}
                sx={{ mt: 3, fontFamily: 'Mulish', backgroundColor: 'var(--secondary-color)', '&:hover': { backgroundColor: '#71aea3' } }} onClick={handleClick}>
                Book Now
            </Button> */}
            <Button
                variant="contained"
                fullWidth
                disabled={item.roomsAvailable === 0}
                sx={{
                    mt: 3,
                    fontFamily: 'Mulish',
                    backgroundColor: item.roomsAvailable === 0 ? '#ccc' : 'var(--secondary-color)',
                    '&:hover': {
                        backgroundColor: item.roomsAvailable === 0 ? '#ccc' : '#71aea3'
                    }
                }}
                onClick={handleClick}
            >
                {item.roomsAvailable === 0 ? 'Sold Out' : 'Book Now'}
            </Button>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                TransitionComponent={slideTransition}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{
                        width: '100%',
                        fontSize: '1rem',
                        py: 2,
                        px: 3,
                        fontWeight: 600
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default BookingForm;


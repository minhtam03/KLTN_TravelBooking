import React, { useState, useContext, useEffect } from 'react';
import {
    Grid,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    List,
    ListItem,
} from '@mui/material';
import { Snackbar, Alert, Slide } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/config';
import axios from 'axios';

import vietnamAirlinesLogo from '../../assets/images/vnairline.jpg';
import vietjetLogo from '../../assets/images/vietjet.jpg';
import bambooLogo from '../../assets/images/bamboo.jpg';


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


const BookingFlightForm = ({ flight }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: '',
        dateOfBirth: '',
        passportId: '',
        phone: '',
        guestSize: 1,
    });

    const serviceFee = 0;
    const totalAmount = flight.totalPriceUSD * form.guestSize + serviceFee;

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === 'guestSize' ? parseInt(value) || 1 : value
        }));
    };

    useEffect(() => {
        console.log("✅ flight received:", flight);
    }, [flight]);

    const handleSubmit = async e => {
        e.preventDefault();
        if (!user) {
            showSnackbar('Please sign in first.', 'warning');
            return;
        }
        if (!flight || !flight._id) return alert('Flight data is not ready yet. Please wait.');

        try {
            const bookingData = {
                userId: user._id,
                userEmail: user.email,
                fullName: form.fullName,
                dateOfBirth: form.dateOfBirth,
                passportId: form.passportId,
                phone: form.phone,
                guestSize: form.guestSize,
                flightId: flight._id,
            };

            console.log("📦 Sending booking:", bookingData);

            const res = await axios.post(`${BASE_URL}/booking/flight`, bookingData, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });

            const bookingId = res?.data?.data?._id;
            if (!bookingId) return alert("Booking failed.");

            const paymentRes = await axios.post(`${BASE_URL}/payments`, {
                bookingId,
                userId: user._id,
                price: totalAmount,
                type: 'flight',
                name: flight.flightNumber
            }, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });

            const paymentUrl = paymentRes?.data?.session?.url;
            if (!paymentUrl) return alert("Payment failed.");

            window.location.href = paymentUrl;

        } catch (err) {
            console.error("❌ Booking or payment error:", err);
            alert("Something went wrong.");
        }
    };

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

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
        <Box sx={{ padding: 4 }}>
            <Grid container spacing={4}>
                {/* Cột trái: Thông tin chuyến bay */}
                <Grid item xs={12} md={7}>
                    <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, fontFamily: 'Mulish' }}>
                        <Box sx={{ mb: 2 }}>
                            <img
                                src={getAirlineLogo(flight.airline)}
                                alt="Flight"
                                style={{
                                    width: '100%',
                                    height: 200,
                                    objectFit: 'cover',
                                    borderRadius: 12,
                                }}
                            />
                        </Box>

                        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontFamily: 'Mulish' }}>
                            Flight Information
                        </Typography>

                        <Box component={Grid} container spacing={1} mt={2}>
                            {[
                                ['Flight Airline:', flight.airline],
                                ['Flight Number:', flight.flightNumber],
                                ['From:', `${flight.fromPlace} (${flight.fromPlaceCode})`],
                                ['To:', `${flight.toPlace} (${flight.toPlaceCode})`],
                                ['Aircraft:', flight.aircraftStr],
                                ['Ticket Type:', flight.ticketType],
                                ['Price:', `$${flight.totalPriceUSD}`],
                                ['Departure:', `${flight.departDate} at ${flight.departTimeStr}`],
                                ['Landing:', `${flight.landingDate} at ${flight.landingTimeStr}`],
                            ].map(([label, value], index) => (
                                <React.Fragment key={index}>
                                    <Grid item xs={5}><Typography fontWeight={600}>{label}</Typography></Grid>
                                    <Grid item xs={7}><Typography>{value}</Typography></Grid>
                                </React.Fragment>
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                {/* Cột phải: Form hành khách */}
                <Grid item xs={12} md={5}>
                    <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                            Passenger Information
                        </Typography>

                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                        >
                            {[
                                ['fullName', 'Full Name', 'text'],
                                ['dateOfBirth', 'Date of Birth', 'date'],
                                ['passportId', 'Passport/ID Number', 'text'],
                                ['phone', 'Phone Number', 'text'],
                                ['guestSize', 'Number of Passengers', 'number'],
                            ].map(([name, label, type]) => (
                                <TextField
                                    key={name}
                                    variant="standard"
                                    name={name}
                                    label={label}
                                    type={type}
                                    fullWidth
                                    required
                                    InputLabelProps={type === 'date' ? { shrink: true } : {}}
                                    inputProps={type === 'number' ? { min: 1 } : {}}
                                    onChange={handleChange}
                                />
                            ))}

                            <List disablePadding>
                                <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography>${flight.totalPriceUSD} x {form.guestSize} person(s)</Typography>
                                    <Typography>${flight.totalPriceUSD * form.guestSize}</Typography>
                                </ListItem>
                                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                    <Typography>Total</Typography>
                                    <Typography>${totalAmount}</Typography>
                                </ListItem>
                            </List>

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{
                                    mt: 3,
                                    backgroundColor: 'var(--secondary-color)',
                                    '&:hover': { backgroundColor: '#71aea3' }
                                }}
                            >
                                Book Now
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
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
        </Box>
    );
};

export default BookingFlightForm;

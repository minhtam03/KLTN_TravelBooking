import React, { useState, useContext } from 'react';
import {
    Grid,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Divider, List,
    ListItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/config';

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
    const totalAmount = flight.price * form.guestSize + serviceFee;

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === 'guestSize' ? parseInt(value) || 1 : value
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!user) return alert('Please sign in first.');

        try {
            // Gửi đúng dữ liệu backend yêu cầu
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

            const res = await fetch(`${BASE_URL}/booking/flight`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(bookingData)
            });

            const result = await res.json();
            if (!res.ok) return alert(result.message);

            const bookingId = result?.data?._id;
            if (!bookingId) return alert("Booking failed.");

            // Tạo phiên thanh toán
            const resPayment = await fetch(`${BASE_URL}/payments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    bookingId,
                    userId: user._id,
                    price: totalAmount,
                    type: 'flight',
                    name: flight.flightNumber
                })
            });

            const paymentResult = await resPayment.json();
            if (!resPayment.ok || !paymentResult.session?.url) {
                return alert("Payment failed.");
            }

            window.location.href = paymentResult.session.url;

        } catch (err) {
            console.error("Booking error:", err);
            alert("Something went wrong.");
        }
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Grid container spacing={4}>
                {/* Cột trái: Thông tin chuyến bay */}
                <Grid item xs={12} md={7}>
                    <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, fontFamily: 'Mulish' }}>
                        {/* Ảnh chuyến bay */}
                        <Box sx={{ mb: 2 }}>
                            <img
                                src={flight.photo || 'https://www.libertytravel.com/sites/default/files/styles/full_size/public/flight-hero.jpg?itok=LKyRwKDq'} // dùng ảnh mặc định nếu không có
                                alt="Flight"
                                style={{
                                    width: '100%',
                                    height: 200,
                                    objectFit: 'cover',
                                    borderRadius: 12,
                                }}
                            />
                        </Box>

                        {/* Tiêu đề */}
                        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontFamily: 'Mulish' }}>
                            Flight Information
                        </Typography>

                        {/* Thông tin 2 cột */}
                        <Box component={Grid} container spacing={1} mt={2}>
                            <Grid item xs={5}>
                                <Typography fontWeight={600} sx={{ fontFamily: 'Mulish' }}>Flight Airline:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <Typography sx={{ fontFamily: 'Mulish' }}>{flight.airline}</Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography fontWeight={600} sx={{ fontFamily: 'Mulish' }}>Flight Number:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <Typography sx={{ fontFamily: 'Mulish' }}>{flight.flightNumber}</Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography fontWeight={600} sx={{ fontFamily: 'Mulish' }}>From:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <Typography sx={{ fontFamily: 'Mulish' }}>{flight.departureCity}</Typography>
                            </Grid>

                            <Grid item xs={5}>
                                <Typography fontWeight={600} sx={{ fontFamily: 'Mulish' }}>To:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <Typography sx={{ fontFamily: 'Mulish' }}>{flight.arrivalCity}</Typography>
                            </Grid>

                            <Grid item xs={5}>
                                <Typography fontWeight={600} sx={{ fontFamily: 'Mulish' }}>Departure:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <Typography sx={{ fontFamily: 'Mulish' }}>
                                    {new Date(flight.departureDate).toLocaleDateString()} at {flight.departureTime}
                                </Typography>
                            </Grid>

                            {flight.tripType === 'round-trip' && (
                                <>
                                    <Grid item xs={5}>
                                        <Typography fontWeight={600} sx={{ fontFamily: 'Mulish' }}>Return:</Typography>
                                    </Grid>
                                    <Grid item xs={7}>
                                        <Typography sx={{ fontFamily: 'Mulish' }}>
                                            {new Date(flight.returnDate).toLocaleDateString()} at {flight.returnTime}
                                        </Typography>
                                    </Grid>
                                </>
                            )}

                            <Grid item xs={5}>
                                <Typography fontWeight={600} sx={{ fontFamily: 'Mulish' }}>Class:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <Typography sx={{ fontFamily: 'Mulish' }}>{flight.flightClass}</Typography>
                            </Grid>

                            <Grid item xs={5}>
                                <Typography fontWeight={600} sx={{ fontFamily: 'Mulish' }}>Airplane:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <Typography sx={{ fontFamily: 'Mulish' }}>{flight.airplaneType}</Typography>
                            </Grid>

                            <Grid item xs={5}>
                                <Typography fontWeight={600} sx={{ fontFamily: 'Mulish' }}>Price:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <Typography sx={{ fontFamily: 'Mulish' }}>${flight.price} / person</Typography>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>

                {/* Cột phải: Form hành khách */}
                <Grid item xs={12} md={5}>
                    <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, fontFamily: 'Mulish' }}>
                        <Typography variant="h6" fontWeight={700} sx={{ fontFamily: 'Mulish', mb: 2 }}>
                            Passenger Information
                        </Typography>

                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                        >
                            <TextField
                                variant="standard"
                                name="fullName"
                                label="Full Name"
                                fullWidth
                                required
                                onChange={handleChange}
                                InputProps={{ style: { fontFamily: 'Mulish' } }}
                            />
                            <TextField
                                variant="standard"
                                name="dateOfBirth"
                                label="Date of Birth"
                                type="date"
                                fullWidth
                                required
                                InputLabelProps={{ shrink: true }}
                                onChange={handleChange}
                                InputProps={{ style: { fontFamily: 'Mulish' } }}
                            />
                            <TextField
                                variant="standard"
                                name="passportId"
                                label="Passport/ID Number"
                                fullWidth
                                required
                                onChange={handleChange}
                                InputProps={{ style: { fontFamily: 'Mulish' } }}
                            />
                            <TextField
                                variant="standard"
                                name="phone"
                                label="Phone Number"
                                fullWidth
                                required
                                onChange={handleChange}
                                InputProps={{ style: { fontFamily: 'Mulish' } }}
                            />
                            <TextField
                                variant="standard"
                                name="guestSize"
                                label="Number of Passengers"
                                type="number"
                                fullWidth
                                required
                                inputProps={{ min: 1 }}
                                onChange={handleChange}
                                InputProps={{ style: { fontFamily: 'Mulish' } }}
                            />

                            <List disablePadding>
                                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Mulish' }}>
                                    <Typography sx={{ fontFamily: 'Mulish' }}>
                                        ${flight.price} x {form.guestSize} person(s)
                                    </Typography>
                                    <Typography sx={{ fontFamily: 'Mulish' }}>
                                        ${flight.price * form.guestSize}
                                    </Typography>
                                </ListItem>
                                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontFamily: 'Mulish' }}>
                                    <Typography sx={{ fontFamily: 'Mulish', fontWeight: 'bold' }}>Total</Typography>
                                    <Typography sx={{ fontFamily: 'Mulish', fontWeight: 'bold' }}>${totalAmount}</Typography>
                                </ListItem>
                            </List>

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{
                                    mt: 3,
                                    fontFamily: 'Mulish',
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
        </Box>
    );
};

export default BookingFlightForm;

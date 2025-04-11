import React, { useState, useContext } from 'react';
import {
    Grid,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Divider
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

    const serviceFee = 10;
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
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 3, borderRadius: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Flight Information
                        </Typography>
                        <Box mt={2}>
                            <Typography><strong>Flight:</strong> {flight.airline} - {flight.flightNumber}</Typography>
                            <Typography><strong>From:</strong> {flight.departureCity}</Typography>
                            <Typography><strong>To:</strong> {flight.arrivalCity}</Typography>
                            <Typography><strong>Departure:</strong> {new Date(flight.departureDate).toLocaleDateString()} at {flight.departureTime}</Typography>
                            {flight.tripType === 'round-trip' && (
                                <Typography><strong>Return:</strong> {new Date(flight.returnDate).toLocaleDateString()} at {flight.returnTime}</Typography>
                            )}
                            <Typography><strong>Class:</strong> {flight.flightClass}</Typography>
                            <Typography><strong>Airplane:</strong> {flight.airplaneType}</Typography>
                            <Typography><strong>Price:</strong> ${flight.price} /person</Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Cột phải: Form hành khách */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 3, borderRadius: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Passenger Information
                        </Typography>

                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
                        >
                            <TextField name="fullName" label="Full Name" required fullWidth onChange={handleChange} />
                            <TextField name="dateOfBirth" label="Date of Birth" type="date" InputLabelProps={{ shrink: true }} required fullWidth onChange={handleChange} />
                            <TextField name="passportId" label="Passport/ID Number" required fullWidth onChange={handleChange} />
                            <TextField name="phone" label="Phone Number" required fullWidth onChange={handleChange} />
                            <TextField name="guestSize" label="Number of Passengers" type="number" inputProps={{ min: 1 }} required fullWidth onChange={handleChange} />

                            <Divider sx={{ my: 2 }} />

                            <Box>
                                <Typography><strong>Price x {form.guestSize}:</strong> ${flight.price * form.guestSize}</Typography>
                                <Typography><strong>Service Fee:</strong> ${serviceFee}</Typography>
                                <Typography variant="h6" sx={{ mt: 1 }}>
                                    <strong>Total:</strong> ${totalAmount}
                                </Typography>
                            </Box>

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                sx={{
                                    mt: 3,
                                    backgroundColor: '#7bbcb0',
                                    '&:hover': { backgroundColor: '#5daea1' }
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

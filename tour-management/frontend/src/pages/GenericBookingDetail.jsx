import React, { useEffect, useContext, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";
import { Container, Grid, Typography, Button, Paper, Divider, Box, Stack } from "@mui/material";

const GenericBookingDetail = ({ type }) => {
    const { user } = useContext(AuthContext);
    const { bookingId } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const serviceFee = 10;

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

                if (!res.ok) {
                    throw new Error(result.message || "Failed to fetch booking details.");
                }

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

        let unitPrice = 0;
        let quantity = 1;
        let itemName = "";

        if (type === "tour") {
            unitPrice = booking.tourId?.price || 0;
            quantity = booking.guestSize;
            itemName = booking.tourName;
        } else if (type === "hotel") {
            unitPrice = booking.hotelId?.pricePerNight || 0;
            quantity = booking.nights;
            itemName = booking.hotelName;
        } else {
            unitPrice = booking.price || 0;
            itemName = booking.name;
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
                headers: {
                    "Content-Type": "application/json",
                },
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

    const item = type === "tour" ? booking.tourId : booking.hotelId;
    const image = item?.photo;
    const name = item?.title || item?.hotelName || "Service";
    const dateLabel = type === "tour" ? "Tour Date" : "Check-in Date";
    const quantityLabel = type === "tour" ? "Guest" : "Nights";
    const quantity = type === "tour" ? booking.guestSize : booking.nights;
    const unitPrice = type === "tour" ? item?.price : item?.pricePerNight;
    const totalPrice = unitPrice * quantity + serviceFee;
    const detailLink = type === "tour" ? `/tours/${item?._id}` : `/stays/${item?._id}`;

    return (
        <Container sx={{ mt: 5, width: "80%" }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography
                    variant="h4"
                    align="center"
                    gutterBottom
                    sx={{
                        fontWeight: 600,
                        color: "primary.main",
                        mb: 3,
                        textTransform: "uppercase",
                        letterSpacing: 1
                    }}
                >
                    Booking Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <img
                            src={image || ""}
                            alt={name}
                            style={{
                                width: "100%",
                                height: "auto",
                                borderRadius: "8px",
                                objectFit: "cover",
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Stack spacing={1.2}>
                            <Typography variant="h6">
                                <Link to={detailLink} className="tour-link" style={{ textDecoration: 'none', color: '#1976d2' }}>
                                    {name}
                                </Link>
                            </Typography>
                            <Typography><strong>Booked by:</strong> {booking.fullName} ({booking.userEmail})</Typography>
                            <Typography><strong>Contact:</strong> {booking.phone}</Typography>
                            <Typography><strong>{dateLabel}:</strong> {new Date(booking.bookAt).toLocaleDateString()}</Typography>
                            <Typography><strong>Booking Date:</strong> {new Date(booking.createdAt).toLocaleDateString()}</Typography>
                            <Typography><strong>Price per unit:</strong> ${unitPrice}</Typography>
                            <Typography><strong>{quantityLabel}:</strong> {quantity}</Typography>
                            <Typography><strong>Total:</strong> ${totalPrice}</Typography>
                            <Typography><strong>Status:</strong> {booking.paymentStatus || "Pending"}</Typography>
                        </Stack>

                        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                            <Button variant="outlined" color="error">
                                Cancel Booking
                            </Button>
                            {booking.paymentStatus === "pending" && (
                                <Button variant="contained" color="primary" onClick={handleContinuePayment}>
                                    Continue Payment
                                </Button>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default GenericBookingDetail;

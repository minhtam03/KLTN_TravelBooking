// import React from 'react';
// import { Card, CardContent, Typography, Box } from '@mui/material';

// const FlightCard = ({ flight }) => {
//     return (
//         <Card>
//             <CardContent>
//                 <Typography variant="h6" gutterBottom>
//                     {flight.airline} - {flight.flightNumber}
//                 </Typography>

//                 <Typography>
//                     <strong>{flight.departureCity}</strong> → <strong>{flight.arrivalCity}</strong>
//                 </Typography>

//                 <Box mt={1}>
//                     <Typography variant="body2">
//                         <strong>Depart:</strong> {new Date(flight.departureDate).toLocaleDateString()} {flight.departureTime}
//                     </Typography>

//                     {flight.tripType === 'round-trip' && (
//                         <Typography variant="body2">
//                             <strong>Return:</strong> {new Date(flight.returnDate).toLocaleDateString()} {flight.returnTime}
//                         </Typography>
//                     )}

//                     <Typography variant="body2">
//                         <strong>Class:</strong> {flight.class}
//                     </Typography>

//                     <Typography variant="body2">
//                         <strong>Price:</strong> ${flight.price}
//                     </Typography>
//                 </Box>
//             </CardContent>
//         </Card>
//     );
// };

// export default FlightCard;

import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Grid, Typography, Button, Box, Chip } from '@mui/material';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import { Link } from 'react-router-dom';

const FlightCard = ({ flight }) => {
    return (
        <Card sx={{ display: 'flex', p: 2, borderRadius: 3, boxShadow: 3, mb: 4 }}>
            {/* Icon máy bay */}
            <CardMedia
                sx={{
                    width: 200,
                    height: 200,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#e0f7fa',
                }}
            >
                <AirplanemodeActiveIcon sx={{ fontSize: 60, color: '#0097a7' }} />
            </CardMedia>

            {/* Nội dung */}
            <Grid container spacing={2} sx={{ ml: 2 }}>
                <Grid item xs={12} md={8}>
                    <CardContent sx={{ paddingBottom: 0 }}>
                        <Typography variant="h6" color="primary">
                            {flight.airline} - {flight.flightNumber}
                        </Typography>

                        <Box mt={1}>
                            <Chip label={`${flight.departureCity} → ${flight.arrivalCity}`} color="primary" size="small" />
                        </Box>

                        <Box mt={1}>
                            <Chip
                                label={flight.tripType === "round-trip" ? "Round-trip" : "One-way"}
                                color={flight.tripType === "round-trip" ? "info" : "warning"}
                                size="small"
                                sx={{ fontWeight: 500 }}
                            />
                        </Box>

                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Departure: {new Date(flight.departureDate).toLocaleDateString()} at {flight.departureTime}
                        </Typography>

                        {flight.tripType === 'round-trip' && (
                            <Typography variant="body2">
                                Return: {new Date(flight.returnDate).toLocaleDateString()} at {flight.returnTime}
                            </Typography>
                        )}

                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Class: <strong>{flight.class}</strong>
                        </Typography>

                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Airplane Type: {flight.airplaneType}
                        </Typography>
                    </CardContent>
                </Grid>

                {/* Giá và hành động */}
                <Grid item xs={12} md={4} sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="h6" fontWeight={600}>
                            ${flight.price}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Includes taxes and fees
                        </Typography>
                    </Box>

                    <CardActions sx={{ justifyContent: 'flex-end', p: 0, mt: 1 }}>
                        <Button
                            variant="contained"
                            component={Link}
                            to={`/flights/${flight._id}`} // giả định có route chi tiết
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
                            Book now
                        </Button>
                    </CardActions>
                </Grid>
            </Grid>
        </Card>
    );
};

export default FlightCard;


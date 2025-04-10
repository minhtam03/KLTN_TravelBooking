import React from 'react';
import { Grid, Typography, MenuItem, FormControl, InputLabel, Select, Box, Tooltip } from '@mui/material';
import TourCard from "../../shared/TourCard";
import CustomTooltip from "../Tooltip/Tooltip";
import { Fade } from '@mui/material';

const SuggestionResult = ({
    results,
    selectedTour,
    selectedFlight,
    selectedHotel,
    duration,
    handleSelect,
    isOptionDisabled,
    totalCost,
    reason,
    destination
}) => {
    const filteredFlights = selectedTour
        ? results.flights.filter(f => f.arrivalCity === selectedTour.city)
        : [];

    const filteredHotels = selectedTour
        ? results.hotels.filter(h => h.location === selectedTour.city)
        : [];

    const tooltipProps = {
        arrow: true,
        placement: 'right',
        enterDelay: 200,
        TransitionComponent: Fade,
        TransitionProps: { timeout: 300 },
        componentsProps: {
            tooltip: {
                sx: {
                    backgroundColor: "#fff",
                    color: "inherit",
                    boxShadow: "none !important",
                    border: "1px solid #ddd",          // ✅ Viền mỏng màu xám nhẹ
                    borderRadius: "8px",               // Bo góc nhẹ cho đẹp
                    padding: "10px",                   // Tăng khoảng cách bên trong
                }
            },
            arrow: { sx: { color: "#fff" } }
        }
    };


    return (
        <Box sx={{ marginTop: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#444', fontWeight: 'medium' }}>
                Results:
            </Typography>

            {reason && !destination && (
                <Typography variant="body2" sx={{ color: 'gray', mb: 2 }}>
                    Reason: {reason}
                </Typography>
            )}

            <Grid container spacing={4}>
                {/* TOUR */}
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel id="select-tour">Tour</InputLabel>
                        <Select
                            labelId="select-tour"
                            label="Tour"
                            value={selectedTour || ''}
                            onChange={(e) => handleSelect('tour', e.target.value)}
                            renderValue={(selected) => selected?.title || "Select a tour"}
                        >
                            {results.tours.map((tour, index) => (
                                <MenuItem
                                    key={index}
                                    value={tour}
                                    disabled={isOptionDisabled('tour', tour)}
                                    sx={{ position: 'relative' }}
                                >
                                    <Tooltip
                                        title={
                                            <Box sx={{ width: '250px' }}>
                                                <TourCard tour={tour} />
                                            </Box>
                                        }
                                        {...tooltipProps}
                                    >
                                        <Box sx={{ width: '100%' }}>
                                            {tour.title} - ${tour.price}
                                        </Box>
                                    </Tooltip>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* FLIGHT */}
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel id="select-flight">Flight</InputLabel>
                        <Select
                            labelId="select-flight"
                            label="Flight"
                            value={selectedFlight || ''}
                            onChange={(e) => handleSelect('flight', e.target.value)}
                            renderValue={(selected) => selected?.flightNumber || "Select a flight"}
                        >
                            {filteredFlights.map((flight, index) => (
                                <MenuItem
                                    key={index}
                                    value={flight}
                                    disabled={isOptionDisabled('flight', flight)}
                                    sx={{ position: 'relative' }}
                                >
                                    <Tooltip
                                        title={
                                            <Box>
                                                <Typography variant="subtitle1"><strong>Flight:</strong> {flight.flightNumber}</Typography>
                                                <Typography variant="body2">Airline: {flight.airline}</Typography>
                                                <Typography variant="body2">Departure: {new Date(flight.departureDate).toLocaleDateString()}</Typography>
                                                <Typography variant="body2">Class: {flight.class}</Typography>
                                                <Typography variant="body2">Price: ${flight.price}</Typography>
                                            </Box>
                                        }
                                        {...tooltipProps}
                                    >
                                        <Box sx={{ width: '100%' }}>
                                            {flight.flightNumber} - ${flight.price}
                                        </Box>
                                    </Tooltip>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* HOTEL */}
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel id="select-hotel">Hotel</InputLabel>
                        <Select
                            labelId="select-hotel"
                            label="Hotel"
                            value={selectedHotel || ''}
                            onChange={(e) => handleSelect('hotel', e.target.value)}
                            renderValue={(selected) => selected?.hotelName || "Select a hotel"}
                        >
                            {filteredHotels.map((hotel, index) => (
                                <MenuItem
                                    key={index}
                                    value={hotel}
                                    disabled={isOptionDisabled('hotel', hotel)}
                                    sx={{ position: 'relative' }}
                                >
                                    <Tooltip
                                        title={
                                            <Box>
                                                <Typography variant="subtitle1"><strong>Hotel:</strong> {hotel.hotelName}</Typography>
                                                <Typography variant="body2">Stars: {hotel.stars} ⭐</Typography>
                                                <Typography variant="body2">Rooms Available: {hotel.roomsAvailable}</Typography>
                                                <Typography variant="body2">Price per Night: ${hotel.pricePerNight}</Typography>
                                                <Typography variant="body2">Total for {duration} nights: ${hotel.pricePerNight * duration}</Typography>
                                            </Box>
                                        }
                                        {...tooltipProps}
                                    >
                                        <Box sx={{ width: '100%' }}>
                                            {hotel.hotelName} - ${hotel.pricePerNight * duration}
                                        </Box>
                                    </Tooltip>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Typography variant="h6" sx={{ marginTop: 3, color: '#555' }}>
                Total Cost: <strong>${totalCost}</strong>
            </Typography>
        </Box>
    );
};

export default SuggestionResult;


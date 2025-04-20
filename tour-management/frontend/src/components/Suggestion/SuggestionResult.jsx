import React from 'react';
import { Grid, Typography, MenuItem, FormControl, InputLabel, Select, Box, Tooltip } from '@mui/material';
import { Fade } from '@mui/material';
import ItemCardTooltip from '../Tooltip/ItemCardToolTip';

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
    destination,
    variant = "outlined"
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
        <Box sx={{ marginTop: 3, marginLeft: 5 }}>
            <Typography variant="h5" gutterBottom
                sx={{ color: '#444', fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
                Results
            </Typography>

            {reason && !destination && (
                <Typography variant="body2" sx={{ color: 'gray', mb: 2 }}>
                    Reason: {reason}
                </Typography>
            )}


            <Grid container spacing={4}>
                {/* TOUR */}
                <Grid item xs={12}>
                    <FormControl fullWidth variant={variant}>
                        <InputLabel id="select-tour">Tour</InputLabel>
                        <Select variant={variant}
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

                                        title={<ItemCardTooltip item={tour} type="tour" />}

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
                <Grid item xs={12}>
                    <FormControl fullWidth variant={variant}>
                        <InputLabel id="select-flight">Flight</InputLabel>
                        <Select variant={variant}
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

                                        title={<ItemCardTooltip item={flight} type="flight" />}
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
                <Grid item xs={12} >
                    <FormControl fullWidth variant={variant}>
                        <InputLabel id="select-hotel">Hotel</InputLabel>
                        <Select variant={variant}
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

                                        title={<ItemCardTooltip item={hotel} type="hotel" />}
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

            <Typography variant="h6" sx={{ marginTop: 10, color: '#555', textAlign: 'center' }}>
                Total Cost: <strong>${totalCost}</strong>
            </Typography>
        </Box>
    );
};

export default SuggestionResult;
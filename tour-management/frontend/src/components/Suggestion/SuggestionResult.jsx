// // SuggestionResult.jsx (final - conditional logic for destination or not)
// import React, { useState, useEffect, useContext } from 'react';
// import { Grid, Typography, MenuItem, FormControl, InputLabel, Select, Box, Tooltip } from '@mui/material';
// import { Fade } from '@mui/material';
// import ItemCardTooltip from '../Tooltip/ItemCardToolTip';

// const SuggestionResult = ({
//     results,
//     selectedTour,
//     selectedFlight,
//     selectedReturnFlight,
//     selectedHotel,
//     duration,
//     handleSelect,
//     isOptionDisabled,
//     totalCost,
//     reason,
//     destination,
//     variant = "outlined"
// }) => {
//     const filteredFlights = destination
//         ? results.flights
//         : selectedTour
//             ? results.flights.filter(f => f.toPlace === selectedTour.city)
//             : [];

//     const filteredReturnFlights = destination
//         ? results.flightsReturn
//         : selectedTour
//             ? results.flightsReturn.filter(f => f.fromPlace === selectedTour.city)
//             : [];

//     const filteredHotels = destination
//         ? results.hotels
//         : selectedTour
//             ? results.hotels.filter(h => h.location === selectedTour.city)
//             : [];

//     const tooltipProps = {
//         arrow: true,
//         placement: 'right',
//         enterDelay: 200,
//         TransitionComponent: Fade,
//         TransitionProps: { timeout: 300 },
//         componentsProps: {
//             tooltip: {
//                 sx: {
//                     backgroundColor: "#fff",
//                     color: "inherit",
//                     boxShadow: "none !important",
//                     border: "1px solid #ddd",
//                     borderRadius: "8px",
//                     padding: "10px",
//                 }
//             },
//             arrow: { sx: { color: "#fff" } }
//         }
//     };


//     return (
//         <Box sx={{ marginTop: 3, marginLeft: 5 }}>
//             <Typography variant="h5" gutterBottom sx={{ color: '#444', fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
//                 Results
//             </Typography>

//             <Grid container spacing={4}>
//                 {/* TOUR */}
//                 <Grid item xs={12}>
//                     <FormControl fullWidth variant={variant}>
//                         <InputLabel id="select-tour">Tour</InputLabel>
//                         <Select variant={variant}
//                             labelId="select-tour"
//                             label="Tour"
//                             value={selectedTour || ''}
//                             onChange={(e) => handleSelect('tour', e.target.value)}
//                             renderValue={(selected) => selected?.title || "Select a tour"}
//                         >
//                             {results.tours
//                                 .sort((a, b) => {
//                                     const ratingDiff = (b.avgRating || 0) - (a.avgRating || 0);
//                                     if (ratingDiff !== 0) return ratingDiff;
//                                     return a.price - b.price;
//                                 })
//                                 .map((tour, index) => (
//                                     <MenuItem
//                                         key={index}
//                                         value={tour}
//                                         disabled={isOptionDisabled('tour', tour)}
//                                         sx={{ position: 'relative' }}
//                                     >
//                                         <Tooltip title={<ItemCardTooltip item={tour} type="tour" />} {...tooltipProps}>
//                                             <Box sx={{ width: '100%' }}>
//                                                 {tour.title} - ${tour.price}
//                                             </Box>
//                                         </Tooltip>
//                                     </MenuItem>
//                                 ))}
//                         </Select>
//                     </FormControl>
//                 </Grid>

//                 {/* FLIGHT GO */}
//                 <Grid item xs={12}>
//                     <FormControl fullWidth variant={variant}>
//                         <InputLabel id="select-flight">Flight</InputLabel>
//                         <Select variant={variant}
//                             labelId="select-flight"
//                             label="Flight"
//                             value={selectedFlight || ''}
//                             onChange={(e) => handleSelect('flight', e.target.value)}
//                             renderValue={(selected) => selected?.flightNumber || "Select a flight"}
//                         >
//                             {filteredFlights.map((flight, index) => (
//                                 <MenuItem
//                                     key={index}
//                                     value={flight}
//                                     disabled={isOptionDisabled('flight', flight)}
//                                     sx={{ position: 'relative' }}
//                                 >
//                                     <Tooltip title={<ItemCardTooltip item={flight} type="flight" />} {...tooltipProps}>
//                                         <Box sx={{ width: '100%' }}>
//                                             {flight.flightNumber} - ${flight.totalPriceUSD}
//                                         </Box>
//                                     </Tooltip>
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </Grid>

//                 {/* RETURN FLIGHT */}
//                 <Grid item xs={12}>
//                     <FormControl fullWidth variant={variant}>
//                         <InputLabel id="select-return-flight">Return Flight</InputLabel>
//                         <Select variant={variant}
//                             labelId="select-return-flight"
//                             label="Return Flight"
//                             value={selectedReturnFlight || ''}
//                             onChange={(e) => handleSelect('returnFlight', e.target.value)}
//                             renderValue={(selected) => selected?.flightNumber || "Select a return flight"}
//                         >
//                             {filteredReturnFlights.map((flight, index) => (
//                                 <MenuItem
//                                     key={index}
//                                     value={flight}
//                                     disabled={isOptionDisabled('returnFlight', flight)}
//                                     sx={{ position: 'relative' }}
//                                 >
//                                     <Tooltip title={<ItemCardTooltip item={flight} type="flight" />} {...tooltipProps}>
//                                         <Box sx={{ width: '100%' }}>
//                                             {flight.flightNumber} - ${flight.totalPriceUSD}
//                                         </Box>
//                                     </Tooltip>
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </Grid>

//                 {/* HOTEL */}
//                 <Grid item xs={12}>
//                     <FormControl fullWidth variant={variant}>
//                         <InputLabel id="select-hotel">Hotel</InputLabel>
//                         <Select variant={variant}
//                             labelId="select-hotel"
//                             label="Hotel"
//                             value={selectedHotel || ''}
//                             onChange={(e) => handleSelect('hotel', e.target.value)}
//                             renderValue={(selected) => selected?.hotelName || "Select a hotel"}
//                         >
//                             {filteredHotels.map((hotel, index) => (
//                                 <MenuItem
//                                     key={index}
//                                     value={hotel}
//                                     disabled={isOptionDisabled('hotel', hotel)}
//                                     sx={{ position: 'relative' }}
//                                 >
//                                     <Tooltip title={<ItemCardTooltip item={hotel} type="hotel" />} {...tooltipProps}>
//                                         <Box sx={{ width: '100%' }}>
//                                             {hotel.hotelName} - ${hotel.pricePerNight * duration}
//                                         </Box>
//                                     </Tooltip>
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </Grid>
//             </Grid>

//             {reason && !destination && (
//                 <Typography variant="body2" sx={{ color: 'gray', mt: 4 }}>
//                     Reason: {reason}
//                 </Typography>
//             )}

//             <Typography variant="h6" sx={{ marginTop: 5, color: '#555', textAlign: 'center' }}>
//                 Total Cost: <strong>${totalCost}</strong>
//             </Typography>
//         </Box>
//     );
// };

// export default SuggestionResult;

// SuggestionResult.jsx (horizontal card layout with tooltip and image)
import React from 'react';
import {
    Grid,
    Typography,
    Box,
    Card,
    CardContent,
    CardActionArea,
    CardMedia,
    Tooltip,
    Fade
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ItemCardTooltip from '../Tooltip/ItemCardToolTip';

const SuggestionResult = ({
    results,
    selectedTour,
    selectedFlight,
    selectedReturnFlight,
    selectedHotel,
    duration,
    handleSelect,
    isOptionDisabled,
    totalCost,
    reason,
    destination
}) => {
    const filteredFlights = destination
        ? results.flights
        : selectedTour
            ? results.flights.filter(f => f.toPlace === selectedTour.city)
            : [];

    const filteredReturnFlights = destination
        ? results.flightsReturn
        : selectedTour
            ? results.flightsReturn.filter(f => f.fromPlace === selectedTour.city)
            : [];

    const filteredHotels = destination
        ? results.hotels
        : selectedTour
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
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "10px",
                }
            },
            arrow: { sx: { color: "#fff" } }
        }
    };

    const getImage = (item, type) => {
        if (type === 'tour') return item.photo;
        if (type === 'hotel') return item.photo;
        if (type === 'flight' || type === 'returnFlight') return item.image;
        return null;
    };

    const renderCard = (item, type, label, selectedItem, getLabel) => {
        const isTourOrHotel = type === 'tour' || type === 'hotel';
        const rating = item.avgRating || item.stars || 0;
        const price =
            type === 'tour' ? item.price :
                type === 'hotel' ? item.pricePerNight :
                    item.totalPriceUSD;

        return (
            <Grid item key={getLabel(item)} sx={{ minWidth: 180 }}>
                <Tooltip title={<ItemCardTooltip item={item} type={type} />} {...tooltipProps}>
                    <Card
                        variant="outlined"
                        sx={{
                            width: 180,
                            height: 230,
                            borderRadius: 3,
                            overflow: 'hidden',
                            position: 'relative',
                            borderColor: selectedItem && getLabel(item) === getLabel(selectedItem)
                                ? 'primary.main'
                                : 'grey.300',
                            borderWidth: 2,
                            opacity: isOptionDisabled(type, item) ? 0.5 : 1,
                            mb: 1,
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: 4,
                            }
                        }}
                    >

                        <CardActionArea
                            disabled={isOptionDisabled(type, item)}
                            onClick={() => handleSelect(type, item)}
                            sx={{ height: '100%' }}
                        >
                            {/* Image with rounded corners */}
                            <Box sx={{ position: 'relative' }}>
                                <CardMedia
                                    component="img"
                                    image={getImage(item, type)}
                                    alt={getLabel(item)}
                                    sx={{
                                        width: '100%',
                                        height: 120,
                                        objectFit: 'cover',
                                        borderRadius: '16px',
                                        mx: 'auto',

                                    }}
                                />
                                {/* Star rating on top-right */}
                                {isTourOrHotel && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            backgroundColor: 'white',
                                            borderRadius: '12px',
                                            px: 1,
                                            py: 0.2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            boxShadow: 1
                                        }}
                                    >
                                        <StarIcon fontSize="small" sx={{ color: 'orange', mr: 0.3 }} />
                                        <Typography variant="caption" fontWeight="bold">{rating}</Typography>
                                    </Box>
                                )}
                            </Box>

                            {/* Text below */}
                            <CardContent sx={{ textAlign: 'left', px: 1.5, py: 1 }}>
                                <Typography variant="body2" fontWeight="bold" noWrap>{getLabel(item)}</Typography>
                                <Typography variant="body2" color="primary" fontWeight="medium">
                                    ${price} {type === 'hotel' ? "/night" : type === 'flight' || type === 'returnFlight' ? "" : "/person"}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Tooltip>
            </Grid>
        );
    };

    return (
        <Box sx={{ marginTop: 3, marginLeft: 5 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#444', fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
                Results
            </Typography>

            {/* TOURS */}
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Select a Tour</Typography>
            <Grid container spacing={2} wrap="nowrap" sx={{ overflowX: 'auto', pb: 2 }}>
                {results.tours.map(tour => renderCard(tour, 'tour', 'Tour', selectedTour, t => t.title))}
            </Grid>

            {/* FLIGHTS */}
            <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>Select a Flight</Typography>
            <Grid container spacing={2} wrap="nowrap" sx={{ overflowX: 'auto', pb: 2 }}>
                {filteredFlights.map(flight => renderCard(flight, 'flight', 'Flight', selectedFlight, f => f.flightNumber))}
            </Grid>

            {/* RETURN FLIGHTS */}
            <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>Select a Return Flight</Typography>
            <Grid container spacing={2} wrap="nowrap" sx={{ overflowX: 'auto', pb: 2 }}>
                {filteredReturnFlights.map(flight =>
                    renderCard(flight, 'returnFlight', 'Return Flight', selectedReturnFlight, f => f.flightNumber)
                )}
            </Grid>

            {/* HOTELS */}
            <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>Select a Hotel</Typography>
            <Grid container spacing={2} wrap="nowrap" sx={{ overflowX: 'auto', pb: 2 }}>
                {filteredHotels.map(hotel => renderCard(hotel, 'hotel', 'Hotel', selectedHotel, h => h.hotelName))}
            </Grid>

            {reason && !destination && (
                <Typography variant="body2" sx={{ color: 'gray', mt: 4 }}>
                    Reason: {reason}
                </Typography>
            )}

            <Typography variant="h6" sx={{ marginTop: 5, color: '#555', textAlign: 'center' }}>
                Total Cost: <strong>${totalCost}</strong>
            </Typography>
        </Box>
    );
};

export default SuggestionResult;

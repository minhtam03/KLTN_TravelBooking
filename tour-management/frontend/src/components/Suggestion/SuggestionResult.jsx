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
//                             data-testid="select-tour"
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
//                             label="Outbound flight"
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

// SuggestionResult.jsx
// import React from 'react';
// import { Grid, Typography, MenuItem, FormControl, InputLabel, Select, Box, Tooltip, Fade } from '@mui/material';
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
//                         <Select
//                             variant={variant}
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
//                         <InputLabel id="select-flight">Outbound flight</InputLabel>
//                         <Select
//                             variant={variant}
//                             labelId="select-flight"
//                             label="Outbound flight"
//                             value={selectedFlight || ''}
//                             onChange={(e) => handleSelect('flight', e.target.value)}
//                             renderValue={(selected) =>
//                                 selected?.flightNumber ||
//                                 (filteredFlights.length === 0 && selectedTour && !destination
//                                     ? "Không có lựa chọn phù hợp"
//                                     : "Select a flight")
//                             }
//                         >
//                             {filteredFlights.length > 0 ? (
//                                 filteredFlights.map((flight, index) => (
//                                     <MenuItem
//                                         key={index}
//                                         value={flight}
//                                         disabled={isOptionDisabled('flight', flight)}
//                                         sx={{ position: 'relative' }}
//                                     >
//                                         <Tooltip title={<ItemCardTooltip item={flight} type="flight" />} {...tooltipProps}>
//                                             <Box sx={{ width: '100%' }}>
//                                                 {flight.flightNumber} - ${flight.totalPriceUSD}
//                                             </Box>
//                                         </Tooltip>
//                                     </MenuItem>
//                                 ))
//                             ) : (
//                                 selectedTour && !destination && (
//                                     <MenuItem disabled>Không có lựa chọn phù hợp</MenuItem>
//                                 )
//                             )}
//                         </Select>
//                     </FormControl>
//                 </Grid>

//                 {/* RETURN FLIGHT */}
//                 <Grid item xs={12}>
//                     <FormControl fullWidth variant={variant}>
//                         <InputLabel id="select-return-flight">Return flight</InputLabel>
//                         <Select
//                             variant={variant}
//                             labelId="select-return-flight"
//                             label="Return flight"
//                             value={selectedReturnFlight || ''}
//                             onChange={(e) => handleSelect('returnFlight', e.target.value)}
//                             renderValue={(selected) =>
//                                 selected?.flightNumber ||
//                                 (filteredReturnFlights.length === 0 && selectedTour && !destination
//                                     ? "Không có lựa chọn phù hợp"
//                                     : "Select a return flight")
//                             }
//                         >
//                             {filteredReturnFlights.length > 0 ? (
//                                 filteredReturnFlights.map((flight, index) => (
//                                     <MenuItem
//                                         key={index}
//                                         value={flight}
//                                         disabled={isOptionDisabled('returnFlight', flight)}
//                                         sx={{ position: 'relative' }}
//                                     >
//                                         <Tooltip title={<ItemCardTooltip item={flight} type="flight" />} {...tooltipProps}>
//                                             <Box sx={{ width: '100%' }}>
//                                                 {flight.flightNumber} - ${flight.totalPriceUSD}
//                                             </Box>
//                                         </Tooltip>
//                                     </MenuItem>
//                                 ))
//                             ) : (
//                                 selectedTour && !destination && (
//                                     <MenuItem disabled>Không có lựa chọn phù hợp</MenuItem>
//                                 )
//                             )}
//                         </Select>
//                     </FormControl>
//                 </Grid>

//                 {/* HOTEL */}
//                 <Grid item xs={12}>
//                     <FormControl fullWidth variant={variant}>
//                         <InputLabel id="select-hotel">Hotel</InputLabel>
//                         <Select
//                             variant={variant}
//                             labelId="select-hotel"
//                             label="Hotel"
//                             value={selectedHotel || ''}
//                             onChange={(e) => handleSelect('hotel', e.target.value)}
//                             renderValue={(selected) =>
//                                 selected?.hotelName ||
//                                 (filteredHotels.length === 0 && selectedTour && !destination
//                                     ? "Không có lựa chọn phù hợp"
//                                     : "Select a hotel")
//                             }
//                         >
//                             {filteredHotels.length > 0 ? (
//                                 filteredHotels.map((hotel, index) => (
//                                     <MenuItem
//                                         key={index}
//                                         value={hotel}
//                                         disabled={isOptionDisabled('hotel', hotel)}
//                                         sx={{ position: 'relative' }}
//                                     >
//                                         <Tooltip title={<ItemCardTooltip item={hotel} type="hotel" />} {...tooltipProps}>
//                                             <Box sx={{ width: '100%' }}>
//                                                 {hotel.hotelName} - ${hotel.pricePerNight * duration}
//                                             </Box>
//                                         </Tooltip>
//                                     </MenuItem>
//                                 ))
//                             ) : (
//                                 selectedTour && !destination && (
//                                     <MenuItem disabled>Không có lựa chọn phù hợp</MenuItem>
//                                 )
//                             )}
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

import React from 'react';
import { Grid, Typography, MenuItem, FormControl, InputLabel, Select, Box, Tooltip, Fade } from '@mui/material';
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
    destination,
    variant = "outlined"
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

    return (
        <Box sx={{ marginTop: 3, marginLeft: 7 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#444', fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
                Results
            </Typography>

            <Grid container spacing={4}>
                {/* TOUR */}
                <Grid item xs={12}>
                    <FormControl fullWidth variant={variant}>
                        <InputLabel id="select-tour">Tour</InputLabel>
                        <Select
                            variant={variant}
                            labelId="select-tour"
                            label="Tour"
                            value={selectedTour || ''}
                            onChange={(e) => handleSelect('tour', e.target.value)}
                            renderValue={(selected) => selected?.title || "Select a tour"}
                        >
                            {results.tours
                                .sort((a, b) => {
                                    const ratingDiff = (b.avgRating || 0) - (a.avgRating || 0);
                                    if (ratingDiff !== 0) return ratingDiff;
                                    return a.price - b.price;
                                })
                                .map((tour, index) => (
                                    <MenuItem
                                        key={index}
                                        value={tour}
                                        disabled={isOptionDisabled('tour', tour)}
                                        sx={{ position: 'relative' }}
                                    >
                                        <Tooltip title={<ItemCardTooltip item={tour} type="tour" />} {...tooltipProps}>
                                            <Box sx={{ width: '100%' }}>
                                                {tour.title} - ${tour.price}
                                            </Box>
                                        </Tooltip>
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* FLIGHT GO */}
                <Grid item xs={12}>
                    <FormControl fullWidth variant={variant}>
                        <InputLabel id="select-flight">Outbound flight</InputLabel>
                        <Select
                            variant={variant}
                            labelId="select-flight"
                            label="Outbound flight"
                            value={selectedFlight || ''}
                            onChange={(e) => handleSelect('flight', e.target.value)}
                            renderValue={(selected) =>
                                selected?.flightNumber ||
                                (filteredFlights.length === 0 && selectedTour
                                    ? "No suitable options available"
                                    : "Select a flight")
                            }
                        >
                            {filteredFlights.length > 0 ? (
                                filteredFlights.map((flight, index) => (
                                    <MenuItem
                                        key={index}
                                        value={flight}
                                        disabled={isOptionDisabled('flight', flight)}
                                        sx={{ position: 'relative' }}
                                    >
                                        <Tooltip title={<ItemCardTooltip item={flight} type="flight" />} {...tooltipProps}>
                                            <Box sx={{ width: '100%' }}>
                                                {flight.flightNumber} - ${flight.totalPriceUSD}
                                            </Box>
                                        </Tooltip>
                                    </MenuItem>
                                ))
                            ) : (
                                selectedTour && (
                                    <MenuItem disabled>No suitable options available</MenuItem>
                                )
                            )}
                        </Select>
                    </FormControl>
                </Grid>

                {/* RETURN FLIGHT */}
                <Grid item xs={12}>
                    <FormControl fullWidth variant={variant}>
                        <InputLabel id="select-return-flight">Return flight</InputLabel>
                        <Select

                            variant={variant}
                            labelId="select-return-flight"
                            label="Return flight"
                            value={selectedReturnFlight || ''}
                            onChange={(e) => handleSelect('returnFlight', e.target.value)}
                            renderValue={(selected) =>
                                selected?.flightNumber ||
                                (filteredReturnFlights.length === 0 && selectedTour
                                    ? "No suitable options available"
                                    : "Select a return flight")
                            }
                        >
                            {filteredReturnFlights.length > 0 ? (
                                filteredReturnFlights.map((flight, index) => (
                                    <MenuItem
                                        key={index}
                                        value={flight}
                                        disabled={isOptionDisabled('returnFlight', flight)}
                                        sx={{ position: 'relative' }}
                                    >
                                        <Tooltip title={<ItemCardTooltip item={flight} type="flight" />} {...tooltipProps}>
                                            <Box sx={{ width: '100%' }}>
                                                {flight.flightNumber} - ${flight.totalPriceUSD}
                                            </Box>
                                        </Tooltip>
                                    </MenuItem>
                                ))
                            ) : (
                                selectedTour && (
                                    <MenuItem disabled>No suitable options available</MenuItem>
                                )
                            )}
                        </Select>
                    </FormControl>
                </Grid>

                {/* HOTEL */}
                <Grid item xs={12}>
                    <FormControl fullWidth variant={variant}>
                        <InputLabel id="select-hotel">Hotel</InputLabel>
                        <Select
                            variant={variant}
                            labelId="select-hotel"
                            label="Hotel"
                            value={selectedHotel || ''}
                            onChange={(e) => handleSelect('hotel', e.target.value)}
                            renderValue={(selected) =>
                                selected?.hotelName ||
                                (filteredHotels.length === 0 && selectedTour
                                    ? "No suitable options available"
                                    : "Select a hotel")
                            }
                        >
                            {filteredHotels.length > 0 ? (
                                filteredHotels.map((hotel, index) => (
                                    <MenuItem
                                        key={index}
                                        value={hotel}
                                        disabled={isOptionDisabled('hotel', hotel)}
                                        sx={{ position: 'relative' }}
                                    >
                                        <Tooltip title={<ItemCardTooltip item={hotel} type="hotel" />} {...tooltipProps}>
                                            <Box sx={{ width: '100%' }}>
                                                {hotel.hotelName} - ${hotel.pricePerNight * duration}
                                            </Box>
                                        </Tooltip>
                                    </MenuItem>
                                ))
                            ) : (
                                selectedTour && (
                                    <MenuItem disabled>No suitable options available</MenuItem>
                                )
                            )}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {reason && (
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


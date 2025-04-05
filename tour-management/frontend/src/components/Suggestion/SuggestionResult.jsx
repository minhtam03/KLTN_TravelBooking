// import React from 'react';
// import { Grid, Typography, MenuItem, FormControl, InputLabel, Select, Box } from '@mui/material';
// import CustomTooltip from "../Tooltip/Tooltip"
// import TourCard from "../../shared/TourCard"
// import { Tooltip } from '@mui/material';

// const SuggestionResult = ({
//     results,
//     selectedTour,
//     selectedFlight,
//     selectedHotel,
//     duration,
//     handleSelect,
//     isOptionDisabled,
//     totalCost,
//     reason,
//     destination
// }) => {
//     // ✅ Lọc lại flight/hotel tương ứng với city của tour được chọn
//     const filteredFlights = selectedTour
//         ? results.flights.filter(f => f.arrivalCity === selectedTour.city)
//         : [];

//     const filteredHotels = selectedTour
//         ? results.hotels.filter(h => h.location === selectedTour.city)
//         : [];

//     return (
//         <>
//             <Box sx={{ marginTop: 3 }}>
//                 <Typography variant="h5" gutterBottom sx={{ color: '#444', fontWeight: 'medium' }}>
//                     Results:
//                 </Typography>

//                 {reason && !destination && (
//                     <Typography variant="body2" sx={{ color: 'gray', mb: 2 }}>
//                         Reason: {reason}
//                     </Typography>
//                 )}

//                 <Grid container spacing={4}>
//                     <Grid item xs={12} sm={6}>

//                         <FormControl fullWidth>
//                             <InputLabel id="select-tour">Tour</InputLabel>
//                             <Select
//                                 labelId="select-tour"
//                                 label="Tour"
//                                 value={selectedTour || ''}
//                                 onChange={(e) => handleSelect('tour', e.target.value)}
//                                 renderValue={(selected) => selected?.title || "Select a tour"}
//                             >
//                                 {results.tours.map((tour, index) => (
//                                     <MenuItem key={index} value={tour} disabled={isOptionDisabled('tour', tour)}>

//                                         {/* <CustomTooltip title={tour.title} image={tour.photo} 
//                                         details={[`Price: $${tour.price}`, tour.desc]} price={tour.price} /> */}

//                                         <Tooltip
//                                             title={
//                                                 <Box sx={{ width: '250px' }}>
//                                                     <TourCard tour={tour} />
//                                                 </Box>
//                                             }
//                                             arrow
//                                             placement="right"
//                                             // Override style cho tooltip
//                                             sx={{
//                                                 // Ghi đè style của lớp .MuiTooltip-tooltip
//                                                 "& .MuiTooltip-tooltip": {
//                                                     backgroundColor: "#fff",  // Màu nền tooltip
//                                                     color: "inherit",         // Giữ nguyên màu chữ
//                                                     boxShadow: "none !important",        // Bỏ bóng đổ (thường gây cảm giác viền đen)
//                                                     // border: "1px solid #ccc", // Nếu muốn có đường viền xám nhẹ
//                                                 },
//                                                 // Ghi đè style của mũi tên tooltip
//                                                 "& .MuiTooltip-arrow": {
//                                                     color: "#fff",            // Màu mũi tên đồng bộ với nền tooltip
//                                                 },
//                                             }}
//                                         >
//                                             <span>{tour.title}</span>
//                                         </Tooltip>
//                                     </MenuItem>

//                                 ))}
//                             </Select>
//                         </FormControl>

//                     </Grid>

//                     <Grid item xs={12} sm={6}>
//                         <FormControl fullWidth>
//                             <InputLabel id="select-flight">Flight</InputLabel>
//                             <Select
//                                 labelId="select-flight"
//                                 label="Flight"
//                                 value={selectedFlight?.flightNumber || ''}
//                                 onChange={(e) => {
//                                     const found = filteredFlights.find(f => f.flightNumber === e.target.value);
//                                     handleSelect('flight', found);
//                                 }}
//                                 renderValue={(val) => val || "Select a flight"}
//                             >
//                                 {filteredFlights.map((flight, index) => (
//                                     <MenuItem key={index} value={flight.flightNumber} disabled={isOptionDisabled('flight', flight)}>
//                                         <CustomTooltip title={flight.flightNumber} details={[`Price: $${flight.price}`, `Airline: ${flight.airline}`, `Departure Date: ${new Date(flight.departureDate).toLocaleDateString()}`, `Class: ${flight.class}`]} price={flight.price} />
//                                     </MenuItem>
//                                 ))}
//                             </Select>
//                         </FormControl>
//                     </Grid>

//                     <Grid item xs={12} sm={6}>
//                         <FormControl fullWidth>
//                             <InputLabel id="select-hotel">Hotel</InputLabel>
//                             <Select
//                                 labelId="select-hotel"
//                                 label="Hotel"
//                                 value={selectedHotel?.hotelName || ''}
//                                 onChange={(e) => {
//                                     const found = filteredHotels.find(h => h.hotelName === e.target.value);
//                                     handleSelect('hotel', found);
//                                 }}
//                                 renderValue={(val) => val || "Select a hotel"}
//                             >
//                                 {filteredHotels.map((hotel, index) => (
//                                     <MenuItem key={index} value={hotel.hotelName} disabled={isOptionDisabled('hotel', hotel)}>
//                                         <CustomTooltip title={hotel.hotelName} details={[`Price per Night: $${hotel.pricePerNight}`, `Stars: ${hotel.stars} ⭐`, `Rooms Available: ${hotel.roomsAvailable}`]} price={hotel.pricePerNight * duration} />
//                                     </MenuItem>
//                                 ))}
//                             </Select>
//                         </FormControl>
//                         {/* <FormControl fullWidth>
//                             <InputLabel id="select-flight">Flight</InputLabel>
//                             <Select
//                                 labelId="select-flight"
//                                 label="Flight"
//                                 value={selectedFlight?.flightNumber || ''}
//                                 onChange={(e) => {
//                                     const found = filteredFlights.find(f => f.flightNumber === e.target.value);
//                                     handleSelect('flight', found);
//                                 }}
//                                 renderValue={(val) => val || "Select a flight"}
//                             >
//                                 {filteredFlights.map((flight, index) => (
//                                     <Tooltip
//                                         key={index}
//                                         title={<>
//                                             <Typography variant="subtitle1"><strong>Flight:</strong> {flight.flightNumber}</Typography>
//                                             <Typography variant="body2">Airline: {flight.airline}</Typography>
//                                             <Typography variant="body2">Departure: {new Date(flight.departureDate).toLocaleDateString()}</Typography>
//                                             <Typography variant="body2">Class: {flight.class}</Typography>
//                                             <Typography variant="body2">Price: ${flight.price}</Typography>
//                                         </>}
//                                         arrow
//                                         placement="right"
//                                     >
//                                         <MenuItem value={flight.flightNumber} disabled={isOptionDisabled('flight', flight)}>
//                                             {flight.flightNumber} - ${flight.price}
//                                         </MenuItem>
//                                     </Tooltip>
//                                 ))}
//                             </Select>
//                         </FormControl>
//                     </Grid>

//                     <Grid item xs={12} sm={6}>
//                         <FormControl fullWidth>
//                             <InputLabel id="select-hotel">Hotel</InputLabel>
//                             <Select
//                                 labelId="select-hotel"
//                                 label="Hotel"
//                                 value={selectedHotel?.hotelName || ''}
//                                 onChange={(e) => {
//                                     const found = filteredHotels.find(h => h.hotelName === e.target.value);
//                                     handleSelect('hotel', found);
//                                 }}
//                                 renderValue={(val) => val || "Select a hotel"}
//                             >
//                                 {filteredHotels.map((hotel, index) => (
//                                     <Tooltip
//                                         key={index}
//                                         title={<>
//                                             <Typography variant="subtitle1"><strong>Hotel:</strong> {hotel.hotelName}</Typography>
//                                             <Typography variant="body2">Stars: {hotel.stars} ⭐</Typography>
//                                             <Typography variant="body2">Rooms Available: {hotel.roomsAvailable}</Typography>
//                                             <Typography variant="body2">Price per Night: ${hotel.pricePerNight}</Typography>
//                                             <Typography variant="body2">Total for {duration} nights: ${hotel.pricePerNight * duration}</Typography>
//                                         </>}
//                                         arrow
//                                         placement="right"
//                                     >
//                                         <MenuItem value={hotel.hotelName} disabled={isOptionDisabled('hotel', hotel)}>
//                                             {hotel.hotelName} - ${hotel.pricePerNight * duration}
//                                         </MenuItem>
//                                     </Tooltip>
//                                 ))}
//                             </Select>
//                         </FormControl> */}
//                     </Grid>
//                 </Grid>

//                 <Typography variant="h6" sx={{ marginTop: 3, color: '#555' }}>
//                     Total Cost: <strong>${totalCost}</strong>
//                 </Typography>
//             </Box>
//         </>
//     );
// };

// export default SuggestionResult;

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


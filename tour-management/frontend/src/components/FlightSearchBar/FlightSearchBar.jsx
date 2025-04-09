// import React, { useState } from 'react';
// import {
//     Box,
//     TextField,
//     MenuItem,
//     ToggleButton,
//     ToggleButtonGroup,
//     Button,
//     Select,
//     InputLabel,
//     FormControl,
//     Typography,
//     IconButton,
// } from '@mui/material';
// import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
// import { useNavigate } from 'react-router-dom';
// import { cityList } from '../../utils/cities';

// const FlightSearchBar = () => {
//     const [tripType, setTripType] = useState('round-trip');
//     const [flightClass, setFlightClass] = useState('economy');
//     const [departureCity, setDepartureCity] = useState('');
//     const [arrivalCity, setArrivalCity] = useState('');
//     const [departureDate, setDepartureDate] = useState('');
//     const [returnDate, setReturnDate] = useState('');

//     const navigate = useNavigate();

//     const handleSearch = () => {
//         if (!tripType || !departureCity || !arrivalCity || !departureDate) {
//             return alert('Please fill in all required fields');
//         }
//         if (tripType === 'round-trip' && !returnDate) {
//             return alert('Please select return date');
//         }

//         const params = new URLSearchParams({
//             tripType,
//             departureCity,
//             arrivalCity,
//             departureDate,
//             class: flightClass,
//         });

//         if (tripType === 'round-trip') {
//             params.append('returnDate', returnDate);
//         }

//         navigate(`/flights/search?${params.toString()}`);
//     };

//     const handleSwapCities = () => {
//         const temp = departureCity;
//         setDepartureCity(arrivalCity);
//         setArrivalCity(temp);
//     };

//     return (
//         <Box display="flex" alignItems="center" gap={2} p={2} bgcolor="white" borderRadius={4} boxShadow={2} flexWrap="wrap">
//             {/* Trip Type */}
//             <ToggleButtonGroup
//                 value={tripType}
//                 exclusive
//                 onChange={(e, val) => val && setTripType(val)}
//                 size="small"
//             >
//                 <ToggleButton value="one-way">One-Way</ToggleButton>
//                 <ToggleButton value="round-trip">Round-Trip</ToggleButton>
//             </ToggleButtonGroup>

//             {/* Class */}
//             <FormControl size="small">
//                 <InputLabel>Class</InputLabel>
//                 <Select value={flightClass} onChange={(e) => setFlightClass(e.target.value)} label="Class">
//                     <MenuItem value="economy">Economy</MenuItem>
//                     <MenuItem value="business">Business</MenuItem>
//                     <MenuItem value="first">First</MenuItem>
//                 </Select>
//             </FormControl>



//             {/* From - To */}
//             <FormControl size="small">
//                 <TextField
//                     select
//                     label="From"
//                     value={departureCity}
//                     onChange={(e) => setDepartureCity(e.target.value)}
//                 >
//                     {cityList.map((city) => (
//                         <MenuItem key={city} value={city}>{city}</MenuItem>
//                     ))}
//                 </TextField>
//             </FormControl>

//             <IconButton onClick={handleSwapCities}>
//                 <SwapHorizIcon />
//             </IconButton>

//             <FormControl size="small">
//                 <TextField
//                     select
//                     label="To"
//                     value={arrivalCity}
//                     onChange={(e) => setArrivalCity(e.target.value)}
//                 >
//                     {cityList
//                         .filter((city) => city !== departureCity)
//                         .map((city) => (
//                             <MenuItem key={city} value={city}>{city}</MenuItem>
//                         ))}
//                 </TextField>
//             </FormControl>

//             {/* Dates */}
//             <TextField
//                 type="date"
//                 label="Depart"
//                 value={departureDate}
//                 onChange={(e) => setDepartureDate(e.target.value)}
//                 size="small"
//                 InputLabelProps={{ shrink: true }}
//             />

//             {tripType === 'round-trip' && (
//                 <TextField
//                     type="date"
//                     label="Return"
//                     value={returnDate}
//                     onChange={(e) => setReturnDate(e.target.value)}
//                     size="small"
//                     InputLabelProps={{ shrink: true }}
//                 />
//             )}

//             <Button variant="contained" color="error" onClick={handleSearch}>
//                 Search
//             </Button>
//         </Box>
//     );
// };

// export default FlightSearchBar;

import React, { useState } from 'react';
import {
    Box,
    TextField,
    MenuItem,
    Button,
    Chip,
    Grid,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useNavigate } from 'react-router-dom';
import { cityList } from '../../utils/cities';

const FlightSearchBar = () => {
    const [tripType, setTripType] = useState('round-trip');
    const [flightClass, setFlightClass] = useState('');
    const [departureCity, setDepartureCity] = useState('');
    const [arrivalCity, setArrivalCity] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');

    const navigate = useNavigate();

    const handleSearch = () => {
        if (!tripType || !departureCity || !arrivalCity || !departureDate) {
            return alert('Please fill in all required fields');
        }
        if (tripType === 'round-trip' && !returnDate) {
            return alert('Please select return date');
        }

        const params = new URLSearchParams({
            tripType,
            departureCity,
            arrivalCity,
            departureDate,
            class: flightClass,
        });

        if (tripType === 'round-trip') {
            params.append('returnDate', returnDate);
        }

        navigate(`/flights/search?${params.toString()}`);
    };

    const handleSwapCities = () => {
        const temp = departureCity;
        setDepartureCity(arrivalCity);
        setArrivalCity(temp);
    };

    return (
        <Box p={3} bgcolor="white" borderRadius={2} boxShadow={3}>
            {/* Row 1: Trip Type Selection */}
            <Grid container spacing={2} alignItems="center" mb={2}>
                <Grid item>
                    <Chip
                        label="One Way"
                        clickable
                        onClick={() => setTripType('one-way')}
                        color={tripType === 'one-way' ? 'secondary' : 'default'}
                    />
                    <Chip
                        label="Round Trip"
                        clickable
                        onClick={() => setTripType('round-trip')}
                        color={tripType === 'round-trip' ? 'secondary' : 'default'}
                        sx={{ ml: 1 }}
                    />
                </Grid>
            </Grid>

            {/* Row 2: All Other Fields */}
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={2}>
                    <TextField
                        select
                        fullWidth
                        label="From"
                        value={departureCity}
                        onChange={(e) => setDepartureCity(e.target.value)}
                    >
                        {cityList.map((city) => (
                            <MenuItem key={city} value={city}>{city}</MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item>
                    <SwapHorizIcon onClick={handleSwapCities} sx={{ cursor: 'pointer' }} />
                </Grid>

                <Grid item xs={12} sm={2}>
                    <TextField
                        select
                        fullWidth
                        label="To"
                        value={arrivalCity}
                        onChange={(e) => setArrivalCity(e.target.value)}
                    >
                        {cityList.filter((city) => city !== departureCity).map((city) => (
                            <MenuItem key={city} value={city}>{city}</MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={2}>
                    <TextField
                        fullWidth
                        type="date"
                        label="Depart"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>

                {tripType === 'round-trip' && (
                    <Grid item xs={12} sm={2}>
                        <TextField
                            fullWidth
                            type="date"
                            label="Return"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                )}


                <Grid item xs={12} sm={2}>
                    <TextField
                        select
                        fullWidth
                        label="Class"
                        value={flightClass}
                        onChange={(e) => setFlightClass(e.target.value)}
                    >
                        {/* MenuItem trống ban đầu */}
                        <MenuItem value="">
                            <em>Select class</em> {/* hoặc ghi "Select class" */}
                        </MenuItem>
                        <MenuItem value="economy">Economy</MenuItem>
                        <MenuItem value="business">Business</MenuItem>
                        <MenuItem value="first">First</MenuItem>
                    </TextField>
                </Grid>

                <Grid item>
                    <Button variant="contained" color="primary" onClick={handleSearch}>
                        Search
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default FlightSearchBar;

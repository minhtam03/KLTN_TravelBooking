// import React, { useState } from 'react';
// import {
//     Box, TextField, MenuItem, Button, Grid,
//     RadioGroup, FormControlLabel, Radio, IconButton, Paper
// } from '@mui/material';
// import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
// import { useNavigate } from 'react-router-dom';
// import { cityList } from '../../utils/cities';

// const FlightSearchBar = ({ initialValues = {} }) => {
//     const [tripType, setTripType] = useState(initialValues.tripType || 'round-trip');
//     const [flightClass, setFlightClass] = useState(initialValues.flightClass || '');
//     const [departureCity, setDepartureCity] = useState(initialValues.departureCity || '');
//     const [arrivalCity, setArrivalCity] = useState(initialValues.arrivalCity || '');
//     const [departureDate, setDepartureDate] = useState(initialValues.departureDate || '');
//     const [returnDate, setReturnDate] = useState(initialValues.returnDate || '');

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
//             flightClass,
//         });

//         // const params = new URLSearchParams();
//         // params.append('tripType', tripType);
//         // params.append('departureCity', departureCity);
//         // params.append('arrivalCity', arrivalCity);
//         // params.append('departureDate', departureDate);
//         // params.append('class', flightClass);

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
//         <Paper elevation={4} sx={{ padding: 3, borderRadius: 3, backgroundColor: '#f3f8ff' }}>
//             <RadioGroup
//                 row
//                 value={tripType}
//                 onChange={(e) => setTripType(e.target.value)}
//                 sx={{ mb: 2 }}
//             >
//                 <FormControlLabel value="one-way" control={<Radio />} label="One-Way" />
//                 <FormControlLabel value="round-trip" control={<Radio />} label="Round-Trip" />
//             </RadioGroup>

//             <Grid container spacing={2} alignItems="center" sx={{ width: '100%', flexWrap: 'nowrap' }}>
//                 <Grid item sx={{ flexGrow: 1 }}>
//                     <TextField
//                         select fullWidth label="From"
//                         value={departureCity}
//                         onChange={(e) => setDepartureCity(e.target.value)}
//                     >
//                         {cityList.map((city) => (
//                             <MenuItem key={city} value={city}>{city}</MenuItem>
//                         ))}
//                     </TextField>
//                 </Grid>

//                 <Grid item>
//                     <IconButton onClick={handleSwapCities} color="primary">
//                         <SwapHorizIcon />
//                     </IconButton>
//                 </Grid>

//                 <Grid item sx={{ flexGrow: 1 }}>
//                     <TextField
//                         select fullWidth label="To"
//                         value={arrivalCity}
//                         onChange={(e) => setArrivalCity(e.target.value)}
//                     >
//                         {cityList.filter((city) => city !== departureCity).map((city) => (
//                             <MenuItem key={city} value={city}>{city}</MenuItem>
//                         ))}
//                     </TextField>
//                 </Grid>

//                 <Grid item sx={{ flexGrow: 1 }}>
//                     <TextField
//                         fullWidth type="date" label="Depart"
//                         value={departureDate}
//                         onChange={(e) => setDepartureDate(e.target.value)}
//                         InputLabelProps={{ shrink: true }}
//                     />
//                 </Grid>

//                 {tripType === 'round-trip' && (
//                     <Grid item sx={{ flexGrow: 1 }}>
//                         <TextField
//                             fullWidth type="date" label="Return"
//                             value={returnDate}
//                             onChange={(e) => setReturnDate(e.target.value)}
//                             InputLabelProps={{ shrink: true }}
//                         />
//                     </Grid>
//                 )}

//                 <Grid item sx={{ flexGrow: 1 }}>
//                     <TextField
//                         select fullWidth label="Class"
//                         value={flightClass}
//                         onChange={(e) => setFlightClass(e.target.value)}
//                     >
//                         <MenuItem value=""><em>Select class</em></MenuItem>
//                         <MenuItem value="economy">Economy</MenuItem>
//                         <MenuItem value="business">Business</MenuItem>
//                         <MenuItem value="first">First</MenuItem>
//                     </TextField>
//                 </Grid>

//                 <Grid item>
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={handleSearch}
//                         sx={{ height: '100%' }}
//                     >
//                         SEARCH
//                     </Button>
//                 </Grid>
//             </Grid>
//         </Paper>
//     );
// };

// export default FlightSearchBar;

import React, { useState } from 'react';
import {
    Box, TextField, MenuItem, IconButton, Typography, Grid, RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SearchIcon from '@mui/icons-material/Search';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import EventIcon from '@mui/icons-material/Event';
import ClassIcon from '@mui/icons-material/Class';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { cityList } from '../../utils/cities';

const CustomRadio = styled(Radio)({
    color: '#ccc',
    '&.Mui-checked': {
        color: '#f06262',
    },
});

const FlightSearchBar = ({ initialValues = {} }) => {
    const [tripType, setTripType] = useState(initialValues.tripType || 'round-trip');
    const [flightClass, setFlightClass] = useState(initialValues.flightClass || '');
    const [departureCity, setDepartureCity] = useState(initialValues.departureCity || '');
    const [arrivalCity, setArrivalCity] = useState(initialValues.arrivalCity || '');
    const [departureDate, setDepartureDate] = useState(initialValues.departureDate || '');
    const [returnDate, setReturnDate] = useState(initialValues.returnDate || '');

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
            flightClass,
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

    const fieldStyle = {
        fontFamily: 'Mulish',
        '& input': { fontFamily: 'Mulish' },
        '& .MuiInputLabel-root': { fontFamily: 'Mulish' },
    };

    return (
        <Box
            sx={{
                p: 3,
                px: 4,
                borderRadius: '16px',
                boxShadow: '0 12px 30px rgba(0, 128, 255, 0.1)',
                width: '100%',
                maxWidth: '1200px',

                mb: 5,
                mx: 'auto',
                bgcolor: 'white',
                fontFamily: 'Mulish, sans-serif',
            }}
        >
            <RadioGroup
                row
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
                sx={{ mb: 2 }}
            >
                <FormControlLabel value="one-way" control={<CustomRadio />} label="One-Way" />
                <FormControlLabel value="round-trip" control={<CustomRadio />} label="Round-Trip" />
            </RadioGroup>

            <Grid container spacing={2} alignItems="center" flexWrap="nowrap">
                <Grid item md>
                    <TextField
                        select fullWidth
                        label="From"
                        value={departureCity}
                        onChange={(e) => setDepartureCity(e.target.value)}
                        variant="standard"
                        sx={fieldStyle}
                    >
                        {cityList.map((city) => (
                            <MenuItem key={city} value={city}>{city}</MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item>
                    <IconButton onClick={handleSwapCities}>
                        <SwapHorizIcon />
                    </IconButton>
                </Grid>

                <Grid item md>
                    <TextField
                        select fullWidth
                        label="To"
                        value={arrivalCity}
                        onChange={(e) => setArrivalCity(e.target.value)}
                        variant="standard"
                        sx={fieldStyle}
                    >
                        {cityList.filter((city) => city !== departureCity).map((city) => (
                            <MenuItem key={city} value={city}>{city}</MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item md>
                    <TextField
                        fullWidth
                        type="date"
                        label="Depart"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        variant="standard"
                        InputLabelProps={{ shrink: true }}
                        sx={fieldStyle}
                    />
                </Grid>

                {tripType === 'round-trip' && (
                    <Grid item md>
                        <TextField
                            fullWidth
                            type="date"
                            label="Return"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            variant="standard"
                            InputLabelProps={{ shrink: true }}
                            sx={fieldStyle}
                        />
                    </Grid>
                )}

                <Grid item md>
                    <TextField
                        select fullWidth
                        label="Class"
                        value={flightClass}
                        onChange={(e) => setFlightClass(e.target.value)}
                        variant="standard"
                        sx={fieldStyle}
                    >
                        <MenuItem value=""><em>Select class</em></MenuItem>
                        <MenuItem value="economy">Economy</MenuItem>
                        <MenuItem value="business">Business</MenuItem>
                        <MenuItem value="first">First</MenuItem>
                    </TextField>
                </Grid>

                <Grid item>
                    <IconButton
                        onClick={handleSearch}
                        sx={{
                            backgroundColor: 'var(--secondary-color)',
                            color: '#fff',
                            borderRadius: '10px 5px 10px 5px',
                            '&:hover': {
                                backgroundColor: 'var(--secondary-color)',
                            },
                            height: '56px',
                            width: '56px'
                        }}
                    >
                        <SearchIcon sx={{ fontSize: 24 }} />
                    </IconButton>
                </Grid>
            </Grid>
        </Box>
    );
};

export default FlightSearchBar;

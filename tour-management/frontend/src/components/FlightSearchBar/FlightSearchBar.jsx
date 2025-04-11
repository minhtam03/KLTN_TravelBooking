// import React, { useState } from 'react';
// import {
//     Box, TextField, MenuItem, Button, Grid,
//     RadioGroup, FormControlLabel, Radio, Typography, IconButton, Paper
// } from '@mui/material';
// import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
// import { useNavigate } from 'react-router-dom';
// import { cityList } from '../../utils/cities';

// const FlightSearchBar = () => {
//     const [tripType, setTripType] = useState('round-trip');
//     const [flightClass, setFlightClass] = useState('');
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

//     // Đếm số lượng cột (Return có hay không)
//     const totalColumns = tripType === 'round-trip' ? 8 : 7;

//     return (
//         <Paper elevation={4} sx={{ padding: 3, borderRadius: 3, backgroundColor: '#f3f8ff' }}>
//             {/* <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
//                 Book your flight
//             </Typography> */}

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
    Box, TextField, MenuItem, Button, Grid,
    RadioGroup, FormControlLabel, Radio, IconButton, Paper
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useNavigate } from 'react-router-dom';
import { cityList } from '../../utils/cities';

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

        // const params = new URLSearchParams();
        // params.append('tripType', tripType);
        // params.append('departureCity', departureCity);
        // params.append('arrivalCity', arrivalCity);
        // params.append('departureDate', departureDate);
        // params.append('class', flightClass);

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
        <Paper elevation={4} sx={{ padding: 3, borderRadius: 3, backgroundColor: '#f3f8ff' }}>
            <RadioGroup
                row
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
                sx={{ mb: 2 }}
            >
                <FormControlLabel value="one-way" control={<Radio />} label="One-Way" />
                <FormControlLabel value="round-trip" control={<Radio />} label="Round-Trip" />
            </RadioGroup>

            <Grid container spacing={2} alignItems="center" sx={{ width: '100%', flexWrap: 'nowrap' }}>
                <Grid item sx={{ flexGrow: 1 }}>
                    <TextField
                        select fullWidth label="From"
                        value={departureCity}
                        onChange={(e) => setDepartureCity(e.target.value)}
                    >
                        {cityList.map((city) => (
                            <MenuItem key={city} value={city}>{city}</MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item>
                    <IconButton onClick={handleSwapCities} color="primary">
                        <SwapHorizIcon />
                    </IconButton>
                </Grid>

                <Grid item sx={{ flexGrow: 1 }}>
                    <TextField
                        select fullWidth label="To"
                        value={arrivalCity}
                        onChange={(e) => setArrivalCity(e.target.value)}
                    >
                        {cityList.filter((city) => city !== departureCity).map((city) => (
                            <MenuItem key={city} value={city}>{city}</MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item sx={{ flexGrow: 1 }}>
                    <TextField
                        fullWidth type="date" label="Depart"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>

                {tripType === 'round-trip' && (
                    <Grid item sx={{ flexGrow: 1 }}>
                        <TextField
                            fullWidth type="date" label="Return"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                )}

                <Grid item sx={{ flexGrow: 1 }}>
                    <TextField
                        select fullWidth label="Class"
                        value={flightClass}
                        onChange={(e) => setFlightClass(e.target.value)}
                    >
                        <MenuItem value=""><em>Select class</em></MenuItem>
                        <MenuItem value="economy">Economy</MenuItem>
                        <MenuItem value="business">Business</MenuItem>
                        <MenuItem value="first">First</MenuItem>
                    </TextField>
                </Grid>

                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSearch}
                        sx={{ height: '100%' }}
                    >
                        SEARCH
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default FlightSearchBar;

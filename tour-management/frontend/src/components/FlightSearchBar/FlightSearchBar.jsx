import React, { useState } from 'react';
import {
    Box,
    TextField,
    MenuItem,
    Button,
    Chip,
    Grid,
    RadioGroup, FormControlLabel, Radio
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

            <Grid container spacing={2} alignItems="center" mb={2}>
                <Grid item>
                    <RadioGroup
                        row
                        value={tripType}
                        onChange={(e) => setTripType(e.target.value)}
                    >
                        <FormControlLabel
                            value="one-way"
                            control={<Radio />}
                            label="One-Way"
                        />
                        <FormControlLabel
                            value="round-trip"
                            control={<Radio />}
                            label="Round-Trip"
                        />
                    </RadioGroup>
                </Grid>
            </Grid>

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

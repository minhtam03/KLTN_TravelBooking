import React, { useState } from 'react';
import {
    Box, TextField, MenuItem, IconButton, Typography, Grid, RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { cityList } from '../../utils/cities';
import { cityAirport } from '../../utils/cities';
const CustomRadio = styled(Radio)({
    color: '#ccc',
    '&.Mui-checked': {
        color: '#f06262',
    },
});

const FlightSearchBar = ({ initialValues = {} }) => {
    const [fromPlace, setFromPlace] = useState(initialValues.fromPlace || '');
    const [toPlace, setToPlace] = useState(initialValues.toPlace || '');
    const [departDate, setDepartDate] = useState(initialValues.departDate || '')
    const [ticketType, setTicketType] = useState(initialValues.ticketType || '');

    // const [isReturn, setIsReturn] = useState(false);
    const [isReturn, setIsReturn] = useState(!!initialValues.landingDate);
    const [landingDate, setLandingDate] = useState(initialValues.landingDate || '');

    const navigate = useNavigate();

    const handleSearch = () => {
        if (!fromPlace || !toPlace || !departDate || (isReturn && !landingDate)) {
            return alert('Please fill in all required fields');
        }

        const params = new URLSearchParams({
            fromPlace,
            toPlace,
            departDate,
            ticketType,
        });

        if (isReturn) {
            params.append('landingDate', landingDate);
        }

        navigate(`/flights/search?${params.toString()}`);
    };

    const handleSwapCities = () => {
        const temp = fromPlace;
        setFromPlace(toPlace);
        setToPlace(temp);
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
            <RadioGroup row value={isReturn ? 'return' : 'oneway'} onChange={(e) => setIsReturn(e.target.value === 'return')}>
                <FormControlLabel value="oneway" control={<CustomRadio />} label="One-way" />
                <FormControlLabel value="return" control={<CustomRadio />} label="Round-trip" />
            </RadioGroup>

            <Grid container spacing={2} alignItems="center" flexWrap="nowrap">
                <Grid item md>
                    <TextField
                        select fullWidth
                        label="From"
                        value={fromPlace}
                        onChange={(e) => setFromPlace(e.target.value)}
                        variant="standard"
                        sx={fieldStyle}
                    >
                        {cityAirport.map((city) => (
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
                        value={toPlace}
                        onChange={(e) => setToPlace(e.target.value)}
                        variant="standard"
                        sx={fieldStyle}
                    >
                        {cityAirport.filter((city) => city !== fromPlace).map((city) => (
                            <MenuItem key={city} value={city}>{city}</MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item md>
                    <TextField
                        fullWidth
                        type="date"
                        label="Depart"
                        value={departDate}
                        onChange={(e) => setDepartDate(e.target.value)}
                        variant="standard"
                        InputLabelProps={{ shrink: true }}
                        sx={fieldStyle}
                    />
                </Grid>

                {isReturn && (
                    <Grid item md>
                        <TextField
                            fullWidth
                            type="date"
                            label="Return"
                            value={landingDate}
                            onChange={(e) => setLandingDate(e.target.value)}
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
                        value={ticketType}
                        onChange={(e) => setTicketType(e.target.value)}
                        variant="standard"
                        sx={fieldStyle}
                    >
                        <MenuItem value=""><em>Select class</em></MenuItem>
                        <MenuItem value="eco">Economy</MenuItem>
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


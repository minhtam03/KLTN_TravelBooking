import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    IconButton,
    Typography, Select, MenuItem,
    Grid
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import RoomIcon from '@mui/icons-material/Room';
import TimelineIcon from '@mui/icons-material/Timeline';
import GroupIcon from '@mui/icons-material/Group';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { cityList } from '../utils/cities';

import { BASE_URL } from '../utils/config';

const SearchBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const [locationInput, setLocationInput] = useState('');
    const [duration, setDuration] = useState('');
    const [maxGroupSize, setMaxGroupSize] = useState('');

    useEffect(() => {
        setLocationInput(searchParams.get("city") || '');
        setDuration(searchParams.get("duration") || '');
        setMaxGroupSize(searchParams.get("maxGroupSize") || '');
    }, [location.search]);

    const searchHandler = async () => {
        if (!locationInput && !duration && !maxGroupSize) {
            return alert("Please enter at least one field to search!");
        }

        const res = await fetch(`${BASE_URL}/tours/search/getTourBySearch?city=${locationInput}&duration=${duration}&maxGroupSize=${maxGroupSize}`);
        if (!res.ok) return alert('Something went wrong');
        const result = await res.json();

        navigate(`/tours/search?city=${locationInput}&duration=${duration}&maxGroupSize=${maxGroupSize}`,
            { state: result.data });
    };

    // Reusable style for text fields
    const inputFieldStyle = {
        fontFamily: 'Mulish',
        fontSize: '0.85rem',
        ml: 3,
        '& input': {
            fontFamily: 'Mulish',
            fontSize: '0.85rem',
        },
        '& input::placeholder': {
            fontFamily: 'Mulish',
            fontSize: '0.85rem',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#ccc'
        },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottomColor: '#999',
        },
        '& .MuiInput-underline:before': {
            borderBottomColor: '#ccc',
        },
    };



    return (
        <Box
            sx={{
                p: 2,
                px: 3,
                borderRadius: '10px',
                boxShadow: '0 12px 30px rgba(0, 128, 255, 0.2)',
                width: '100%',
                maxWidth: '1000px',
                mt: 5,
                mb: 5,
                mx: 'auto',
                fontFamily: 'Mulish, sans-serif',
                bgcolor: 'white',
            }}
        >
            <Grid container spacing={2} alignItems="center">
                {/* Location */}
                <Grid item xs={12} sm={6} md={3}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <RoomIcon sx={{ color: '#ee6e6e', fontSize: 20 }} />
                        <Typography variant="body1" fontWeight={700} fontFamily="Mulish">
                            Location
                        </Typography>
                    </Box>
                    {/* <TextField
                        fullWidth
                        placeholder="Where are you going"
                        value={locationInput}
                        onChange={e => setLocationInput(e.target.value)}
                        variant="standard"
                        sx={inputFieldStyle}
                    /> */}
                    <Select
                        fullWidth
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        variant="standard"
                        displayEmpty
                        sx={{
                            ...inputFieldStyle,
                            '& .MuiSelect-root': {
                                color: locationInput ? 'inherit' : '#999',
                            },
                            '& .MuiInputBase-input': {
                                color: locationInput ? 'inherit' : '#999',
                            },
                        }}
                        renderValue={(selected) => selected || "Where are you going"}
                    >
                        <MenuItem value="">
                            <em>Where are you going</em>
                        </MenuItem>
                        {cityList.map((city) => (
                            <MenuItem key={city} value={city}>
                                {city}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>

                {/* Duration */}
                <Grid item xs={12} sm={6} md={3}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <AccessTimeIcon sx={{ color: '#ee6e6e', fontSize: 20 }} />
                        <Typography variant="body1" fontWeight={700} fontFamily="Mulish">
                            Duration
                        </Typography>
                    </Box>
                    <TextField
                        fullWidth
                        type="number"
                        placeholder="How long"
                        value={duration}
                        onChange={e => setDuration(e.target.value)}
                        variant="standard"
                        sx={inputFieldStyle}
                    />
                </Grid>

                {/* Max Group Size */}
                <Grid item xs={12} sm={6} md={3}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <GroupIcon sx={{ color: '#ee6e6e', fontSize: 20 }} />
                        <Typography variant="body1" fontWeight={700} fontFamily="Mulish">
                            Guests
                        </Typography>
                    </Box>
                    <TextField
                        fullWidth
                        type="number"
                        placeholder="How many guests"
                        value={maxGroupSize}
                        onChange={e => setMaxGroupSize(e.target.value)}
                        variant="standard"
                        sx={inputFieldStyle}
                    />
                </Grid>

                {/* Search Icon */}
                <Grid item xs={12} sm={6} md={3} textAlign="center">

                    <IconButton
                        onClick={searchHandler}
                        sx={{
                            backgroundColor: 'var(--secondary-color)',
                            color: '#fff',

                            borderRadius: '10px 5px 10px 5px',
                            '&:hover': {
                                backgroundColor: 'var(--secondary-color)',
                            },

                        }}
                    >

                        {/* <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ fontFamily: 'Mulish', fontSize: '1rem' }}
                        >
                            Search
                        </Typography> */}
                        <SearchIcon sx={{ fontSize: 24 }} />
                    </IconButton>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SearchBar;


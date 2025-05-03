import React from 'react';
import {
    Grid,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel, Paper,
    Box, Button, CircularProgress
} from '@mui/material';
import { cityList } from '../../utils/cities';
import { cityAirport } from '../../utils/cities';

const SuggestionForm = ({
    budget, setBudget,
    duration, setDuration,
    departure, setDeparture,
    destination, setDestination,
    startDate, setStartDate,
    loading,
    onSubmit,
    variant = "outlined"
}) => {
    return (
        <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 3 }}>
            <Grid item xs={12} md={2}>
                <TextField
                    variant={variant}
                    fullWidth
                    label="Budget"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    disabled={loading}
                />
            </Grid>

            <Grid item xs={12} md={2}>
                <TextField
                    variant={variant}
                    fullWidth
                    label="Duration (Days)"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    disabled={loading}
                />
            </Grid>



            <Grid item xs={12} md={2}>
                <FormControl fullWidth variant={variant}>
                    <InputLabel id="select-departure">Departure</InputLabel>
                    <Select
                        variant={variant}
                        labelId="select-departure"
                        value={departure}
                        onChange={(e) => setDeparture(e.target.value)}
                        disabled={loading}
                        renderValue={(selected) => selected || "Select"}
                    >
                        {cityAirport.map((city) => (
                            <MenuItem key={city} value={city}>
                                {city}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
                <FormControl fullWidth variant={variant}>
                    <InputLabel id="select-destination">Destination</InputLabel>
                    <Select
                        variant={variant}
                        labelId="select-destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        disabled={loading}
                        renderValue={(selected) => selected || "Select"}
                    >
                        {cityAirport.map((city) => (
                            <MenuItem key={city} value={city}>
                                {city}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
                <TextField
                    variant={variant}
                    fullWidth
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    disabled={loading}
                />
            </Grid>
            <Grid item>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        px: 3,
                        py: 1.5,
                        ml: 4,
                        backgroundColor: 'var(--secondary-color)',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#71aea3' }
                    }}
                    onClick={onSubmit}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Suggest'}
                </Button>
            </Grid>
        </Grid>


    );
};

export default SuggestionForm;


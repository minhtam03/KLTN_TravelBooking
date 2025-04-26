import React from 'react';
import {
    Grid,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel, Paper,
    Box
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
    variant = "outlined"
}) => {
    return (



        <Grid container spacing={3} sx={{ marginBottom: 3, marginLeft: 4 }}>
            <Grid item xs={12}>
                <Box sx={{ width: '70%', mx: 'auto' }}>
                    <TextField
                        variant={variant}
                        fullWidth
                        label="Budget"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        disabled={loading}
                    />
                </Box>
            </Grid>

            <Grid item xs={12}>
                <Box sx={{ width: '70%', mx: 'auto' }}>
                    <TextField
                        variant={variant}
                        fullWidth
                        label="Duration (Days)"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        disabled={loading}
                    />
                </Box>
            </Grid>

            <Grid item xs={12}>
                <Box sx={{ width: '70%', mx: 'auto' }}>
                    <FormControl fullWidth variant={variant}>
                        <InputLabel id="select-departure">Departure</InputLabel>
                        <Select
                            variant={variant}
                            labelId="select-departure"
                            value={departure}
                            onChange={(e) => setDeparture(e.target.value)}
                            disabled={loading}
                            renderValue={(selected) => selected || "Select a departure"}
                        >
                            {cityAirport.map((city) => (
                                <MenuItem key={city} value={city}>
                                    {city}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Grid>

            <Grid item xs={12}>
                <Box sx={{ width: '70%', mx: 'auto' }}>
                    <FormControl fullWidth variant={variant}>
                        <InputLabel id="select-destination">Destination</InputLabel>
                        <Select
                            variant={variant}
                            labelId="select-destination"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            disabled={loading}
                            renderValue={(selected) => selected || "Select a destination"}
                        >
                            {cityAirport.map((city) => (
                                <MenuItem key={city} value={city}>
                                    {city}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Grid>

            <Grid item xs={12}>
                <Box sx={{ width: '70%', mx: 'auto' }}>
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
                </Box>
            </Grid>
        </Grid>

    );
};

export default SuggestionForm;


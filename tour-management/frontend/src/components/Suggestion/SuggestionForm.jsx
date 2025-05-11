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
        <Grid container spacing={3} sx={{ marginBottom: 3, marginLeft: 12 }}>
            <Grid item xs={12}>
                <Box sx={{ width: '60%', mx: 'auto' }}>
                    <TextField
                        type="number"
                        inputProps={{ min: 1 }}
                        data-testid="input-budget"
                        variant={variant}
                        fullWidth
                        label="Budget"
                        value={budget}
                        // onChange={(e) => setBudget(Number(e.target.value))}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                                setBudget('');
                            } else {
                                const numberValue = Number(value);
                                if (numberValue >= 1) {
                                    setBudget(numberValue);
                                }
                            }
                        }}
                        disabled={loading}
                    />
                </Box>
            </Grid>

            <Grid item xs={12}>
                {/* <Box sx={{ width: '60%', mx: 'auto' }}>
                    <TextField
                        type="number"
                        inputProps={{ min: 1 }}
                        data-testid="input-duration"
                        variant={variant}
                        fullWidth
                        label="Duration (Days)"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        disabled={loading}
                    />
                </Box> */}
                <Box sx={{ width: '60%', mx: 'auto' }}>
                    <TextField
                        type="number"
                        inputProps={{ min: 1 }}
                        data-testid="input-duration"
                        variant={variant}
                        fullWidth
                        label="Duration (Days)"
                        value={duration}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                                setDuration('');
                            } else {
                                const numberValue = Number(value);
                                if (numberValue >= 1) {
                                    setDuration(numberValue);
                                }
                            }
                        }}
                        disabled={loading}
                    />
                </Box>

            </Grid>

            <Grid item xs={12}>
                <Box sx={{ width: '60%', mx: 'auto' }}>
                    <FormControl fullWidth variant={variant}>
                        <InputLabel id="select-departure">Departure</InputLabel>
                        <Select
                            data-testid="select-departure"
                            variant={variant}
                            labelId="select-departure"
                            value={departure}
                            onChange={(e) => setDeparture(e.target.value)}
                            disabled={loading}
                            renderValue={(selected) => selected || "Select a departure"}
                        >
                            {cityAirport.map((city) => (
                                <MenuItem key={city} value={city} data-testid={`city-depart-${city}`}>
                                    {city}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Grid>

            <Grid item xs={12}>
                <Box sx={{ width: '60%', mx: 'auto' }}>
                    <FormControl fullWidth variant={variant}>
                        <InputLabel id="select-destination">Destination</InputLabel>
                        <Select
                            data-testid="select-destination"
                            variant={variant}
                            labelId="select-destination"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            disabled={loading}
                            renderValue={(selected) => selected || "Select a destination"}
                        >
                            {cityAirport.map((city) => (
                                <MenuItem key={city} value={city} data-testid={`city-dest-${city}`}>
                                    {city}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Grid>

            <Grid item xs={12}>
                <Box sx={{ width: '60%', mx: 'auto' }}>
                    <TextField
                        data-testid="input-start-date"
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

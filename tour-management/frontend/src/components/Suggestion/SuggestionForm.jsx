import React from 'react';
import { Grid, TextField, MenuItem, Select, FormControl, InputLabel, Typography } from '@mui/material';

const provinces = [
    'Ha Noi', 'Ho Chi Minh', 'Da Nang', 'Hai Phong', 'Can Tho',
    'Binh Duong', 'Bac Ninh', 'Vinh', 'Hue', 'Long An', 'Nghe An',
    'Bac Giang', 'Quang Ninh', 'Nam Dinh', 'Thanh Hoa', 'Quang Binh',
    'Son La', 'Tien Giang', 'Vinh Long', 'Dak Lak', 'Binh Thuan',
    'Quang Tri', 'Lam Dong', 'An Giang', 'Ninh Binh', 'Tay Ninh',
    'Ben Tre', 'Kien Giang', 'Dong Nai', 'Gia Lai', 'Bac Lieu',
    'Phu Tho', 'Ca Mau', 'Hau Giang', 'Binh Phuoc', 'Ha Giang',
    'Soc Trang', 'Dak Nong', 'Thanh Hoa', 'Lai Chau', 'Ha Tinh',
    'Khanh Hoa', 'Yen Bai', 'Quang Nam', 'Nghe An', 'Bac Kan',
    'Quang Ngai', 'Lang Son', 'Nam Dinh', 'Thai Nguyen', 'Hoa Binh',
    'Quang Binh', 'Tuyen Quang', 'Hien Giang', 'Long An', 'Lam Dong',
    'Sapa', 'Hung Yen', 'Bac Giang', 'Tuyen Quang', 'Quang Tri'
];

const SuggestionForm = ({
    budget, setBudget,
    duration, setDuration,
    departure, setDeparture,
    destination, setDestination,
    startDate, setStartDate,
    loading,
    reason
}) => {
    return (
        <Grid container spacing={4} sx={{ marginBottom: 3 }}>
            <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Budget" value={budget} onChange={(e) => setBudget(e.target.value)} disabled={loading} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Duration (Days)" value={duration} onChange={(e) => setDuration(e.target.value)} disabled={loading} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ borderColor: '#ccc', borderWidth: 1, borderRadius: 1 }}>
                    <InputLabel id="select-departure">Departure</InputLabel>
                    <Select
                        labelId="select-departure"
                        label="Departure"
                        value={departure}
                        onChange={(e) => setDeparture(e.target.value)}
                        disabled={loading}
                        renderValue={(selected) => selected || "Select a departure"}
                    >
                        {provinces.map((province) => (
                            <MenuItem key={province} value={province}>
                                {province}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ borderColor: '#ccc', borderWidth: 1, borderRadius: 1 }}>
                    <InputLabel id="select-destination">Destination</InputLabel>
                    <Select
                        labelId="select-destination"
                        label="Destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        disabled={loading}
                        renderValue={(selected) => selected || "Select a destination"}
                    >
                        {provinces.map((province) => (
                            <MenuItem key={province} value={province}>
                                {province}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} disabled={loading} />
            </Grid>
        </Grid>
    );
};

export default SuggestionForm;

import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, MenuItem, Select, FormControl, InputLabel, Box, CircularProgress } from '@mui/material';
import { BASE_URL } from '../utils/config';
import { Container } from 'reactstrap';
import CommonSection from '../shared/CommonSection';

const provinces = [
  'Ho Chi Minh', 'Ha Noi', 'Da Nang', 'Hai Phong', 'Can Tho',
  'Binh Duong', 'Bac Ninh', 'Vinh', 'Hue', 'Long An', 'Nghe An',
  'Bac Giang', 'Quang Ninh', 'Nam Dinh', 'Thanh Hoa', 'Quang Binh'
];

const Suggestion = () => {
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('');
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/suggestions/suggest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ budget, duration, departure, destination, startDate }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      

      const data = await response.json();
      setResults(data.options || []);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <CommonSection title={"Suggestion"}/>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Search Tours, Flights, and Hotels
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Budget"
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Duration (Days)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Departure</InputLabel>
              <Select
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                disabled={loading}
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
            <FormControl fullWidth>
              <InputLabel>Destination</InputLabel>
              <Select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                disabled={loading}
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
            {/* TextField replacing DatePicker */}
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{
                shrink: true, // Ensure the label doesn't overlap when date is selected
              }}
              disabled={loading}
            />
          </Grid>
        </Grid>

        <Button 
          variant="contained" 
          sx={{ marginTop: 3 }} 
          fullWidth 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Search'}
        </Button>

        {results.length > 0 && (
          <Box sx={{ marginTop: 3 }}>
            <Typography variant="h6" gutterBottom>
              Results:
            </Typography>
            {results.map((option, index) => (
              <Box key={index} sx={{ padding: 2, border: '1px solid #ccc', marginBottom: 2 }}>
                <Typography variant="h6">{option.tour}</Typography>
                <Typography>Flight: {option.flight}</Typography>
                <Typography>Hotel: {option.hotel}</Typography>
                <Typography>
                  Total Cost: {option.totalCost} $
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Suggestion;
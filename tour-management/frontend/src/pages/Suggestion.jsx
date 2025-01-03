import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, MenuItem, Select, FormControl, InputLabel, Box, CircularProgress, Card, CardContent } from '@mui/material';
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
          <Typography variant="h5" gutterBottom sx={{ color: "#1976d2" }}>
            Results:
          </Typography>
        
          {results.map((option, index) => (
            <Card key={index} sx={{ marginBottom: 2, backgroundColor: "#f9f9f9", borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: "#d32f2f" }}>
                  Tour: {option.tour.title}
                </Typography>
                <Typography style={{ whiteSpace: 'pre-line', marginBottom: 2, color: "#333" }}>
                  <strong>Suggested Itinerary:</strong><br /> {option.tour.desc}
                </Typography>
        
                {/* Flight Information */}
                <Typography variant="h6" sx={{ marginTop: 2, color: "#d32f2f" }}>
                  Flight Details:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body1" sx={{ color: "#333" }}><strong>Flight Number:</strong> {option.flight.flightNumber}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body1" sx={{ color: "#333" }}><strong>Airline:</strong> {option.flight.airline}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body1" sx={{ color: "#333" }}><strong>Airplane Type:</strong> {option.flight.airplaneType}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body1" sx={{ color: "#333" }}><strong>Departure Date:</strong> {new Date(option.flight.departureDate).toLocaleDateString()}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body1" sx={{ color: "#333" }}><strong>Class:</strong> {option.flight.class}</Typography>
                  </Grid>
                </Grid>
        
                {/* Hotel Information */}
                <Typography variant="h6" sx={{ marginTop: 2, color: "#d32f2f" }}>
                  Hotel Details:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body1" sx={{ color: "#333" }}><strong>Hotel Name:</strong> {option.hotel.hotelName}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body1" sx={{ color: "#333" }}><strong>Amenities:</strong> {option.hotel.amenities.join(", ")}</Typography>
                  </Grid>
                </Grid>
        
                {/* Total Cost */}
                <Typography variant="h6" sx={{ marginTop: 2, color: "#1976d2" }}>
                  Total Cost: <strong>{option.totalCost} $</strong>
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
        )}
      </Box>
    </Container>
  );
};

export default Suggestion;
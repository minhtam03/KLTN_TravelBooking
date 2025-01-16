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
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [totalCost, setTotalCost] = useState(0);

  const handleSubmit = async () => {
    // Reset total cost and selections
    setTotalCost(0);
    setSelectedTour(null);
    setSelectedFlight(null);
    setSelectedHotel(null);
    if (!budget || !duration || !departure || !destination || !startDate) {
      return alert('Please fill in all fields!');
    }

    if (budget <= 0) {
      return alert('Budget must be greater than 0!');
    }

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
        if (response.status === 404) {
          alert('No options found within your budget. Please adjust your criteria and try again.');
        } else {
          alert('An error occurred while fetching suggestions.');
        }
        return;
      }

      const data = await response.json();

      // Filter unique tours, flights, and hotels
      const uniqueTours = Array.from(
        new Map(data.options.map((item) => [item.tour.title, item.tour])).values()
      );

      const uniqueFlights = Array.from(
        new Map(data.options.map((item) => [item.flight.flightNumber, item.flight])).values()
      );

      const uniqueHotels = Array.from(
        new Map(data.options.map((item) => [item.hotel.hotelName, item.hotel])).values()
      );

      setResults({ tours: uniqueTours, flights: uniqueFlights, hotels: uniqueHotels });
    } catch (error) {
      console.error('Error fetching data', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (type, value) => {
    let newTour = selectedTour;
    let newFlight = selectedFlight;
    let newHotel = selectedHotel;

    // Update selection based on type
    if (type === 'tour') {
      newTour = value;
      setSelectedTour(value);
    } else if (type === 'flight') {
      newFlight = value;
      setSelectedFlight(value);
    } else if (type === 'hotel') {
      newHotel = value;
      setSelectedHotel(value);
    }

    // Calculate total cost
    const total =
      (newTour?.price || 0) +
      (newFlight?.price || 0) +
      (newHotel?.price || 0);

    setTotalCost(total);
  };

  return (
    <Container>
      <CommonSection title={"Suggestion"} />
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
              onChange={(e) => setBudget(Number(e.target.value))}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Duration (Days)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
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
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
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

        {results.tours && results.tours.length > 0 && (
          <Box sx={{ marginTop: 3 }}>
            <Typography variant="h5" gutterBottom>
              Results:
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Tour</InputLabel>
                  <Select
                    value={selectedTour || ''}
                    onChange={(e) => handleSelect('tour', e.target.value)}
                  >
                    {results.tours.map((tour, index) => (
                      <MenuItem
                        key={index}
                        value={tour}
                        disabled={tour.price > budget}
                      >
                        {tour.title} - ${tour.price}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Flight</InputLabel>
                  <Select
                    value={selectedFlight || ''}
                    onChange={(e) => handleSelect('flight', e.target.value)}
                  >
                    {results.flights.map((flight, index) => (
                      <MenuItem
                        key={index}
                        value={flight}
                        disabled={flight.price > budget}
                      >
                        {flight.flightNumber} - ${flight.price}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Hotel</InputLabel>
                  <Select
                    value={selectedHotel || ''}
                    onChange={(e) => handleSelect('hotel', e.target.value)}
                  >
                    {results.hotels.map((hotel, index) => (
                      <MenuItem
                        key={index}
                        value={hotel}
                        disabled={hotel.price > budget}
                      >
                        {hotel.hotelName} - ${hotel.price}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ marginTop: 3 }}>
              Total Cost: <strong>${totalCost}</strong>
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Suggestion;

import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, MenuItem, Select, FormControl, InputLabel, Box, CircularProgress } from '@mui/material';
import { BASE_URL } from '../utils/config';
import { Container } from 'reactstrap';
import CommonSection from '../shared/CommonSection';
import { Tooltip } from '@mui/material';
import CustomTooltip from '../components/Tooltip/Tooltip';

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

  useEffect(() => {
    // Nếu results.tours, results.flights, results.hotels đã có dữ liệu
    if (results.tours?.length > 0) {
      setSelectedTour(results.tours[0]);
    }
    if (results.flights?.length > 0) {
      setSelectedFlight(results.flights[0]);
    }
    if (results.hotels?.length > 0) {
      setSelectedHotel(results.hotels[0]);
    }

    // Tính total cost mặc định
    const initialTotal =
      (results.tours?.[0]?.price || 0) +
      (results.flights?.[0]?.price || 0) +
      ((results.hotels?.[0]?.pricePerNight || 0) * duration || 0);

    setTotalCost(!isNaN(initialTotal) ? initialTotal : 0);
  }, [results, duration]);

  const isOptionDisabled = (type, option) => {
    let tempTotalCost = totalCost;

    if (type === 'tour') {
      tempTotalCost = (option?.price || 0) + (selectedFlight?.price || 0) + (selectedHotel?.price || 0);
    } else if (type === 'flight') {
      tempTotalCost = (selectedTour?.price || 0) + (option?.price || 0) + (selectedHotel?.price || 0);
    } else if (type === 'hotel') {
      tempTotalCost = (selectedTour?.price || 0) + (selectedFlight?.price || 0) + (option?.pricePerNight * duration || 0);
    }

    return tempTotalCost > budget;
  };

  const handleSubmit = async () => {
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

    const total =
      (newTour?.price || 0) +
      (newFlight?.price || 0) +
      (newHotel?.pricePerNight * duration || 0);

    setTotalCost(total);
  };

  return (
    <Container>
      <CommonSection title={"Suggestion"} />
      <Box sx={{ padding: 4, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: '#333', fontWeight: 'bold' }}>
          Search Tours, Flights, and Hotels
        </Typography>

        <Grid container spacing={4} sx={{ marginBottom: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Budget"
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              disabled={loading}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Duration (Days)"
              type="text"
              value={duration}
              onChange={(e) => setDuration((e.target.value))}
              disabled={loading}
              variant="outlined"
            />
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
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 2, fontWeight: 'bold', fontSize: '1rem', padding: '0.75rem' }}
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
        </Button>

        {results.tours && results.tours.length > 0 && (
          <Box sx={{ marginTop: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#444', fontWeight: 'medium' }}>
              Results:
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>


                <FormControl fullWidth>
                  <InputLabel id="select-tour">Tour</InputLabel>
                  <Select
                    labelId="select-tour"
                    label="Tour"
                    value={selectedTour || ''}
                    onChange={(e) => handleSelect('tour', e.target.value)}
                    renderValue={(selected) => selected?.title || "Select a tour"}
                  >
                    {results.tours.map((tour, index) => (
                      <MenuItem key={index} value={tour} disabled={isOptionDisabled('tour', tour)}>

                        <CustomTooltip title={tour.title} image={tour.photo} details={[`Price: $${tour.price}`, tour.desc]} price={tour.price} />

                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="select-flight">Flight</InputLabel>
                  <Select
                    labelId="select-flight"
                    label="Flight"
                    value={selectedFlight || ''}
                    onChange={(e) => handleSelect('flight', e.target.value)}
                    renderValue={(selected) => selected?.flightNumber || "Select a flight"}
                  >
                    {results.flights.map((flight, index) => (
                      <MenuItem key={index} value={flight} disabled={isOptionDisabled('flight', flight)}>
                        <CustomTooltip title={flight.flightNumber} details={[`Price: $${flight.price}`, `Airline: ${flight.airline}`, `Departure Date: ${new Date(flight.departureDate).toLocaleDateString()}`, `Class: ${flight.class}`]} price={flight.price} />

                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="select-hotel">Hotel</InputLabel>
                  <Select
                    labelId="select-hotel"
                    label="Hotel"
                    value={selectedHotel || ''}
                    onChange={(e) => handleSelect('hotel', e.target.value)}
                    renderValue={(selected) => selected?.hotelName || "Select a hotel"}
                  >
                    {results.hotels.map((hotel, index) => (
                      <MenuItem key={index} value={hotel} disabled={isOptionDisabled('hotel', hotel)}>
                        {
                          console.log("hotel: ", hotel)
                        }
                        <CustomTooltip title={hotel.hotelName} details={[`Price per Night: $${hotel.pricePerNight}`, `Stars: ${hotel.stars} ⭐`, `Rooms Available: ${hotel.roomsAvailable}`]} price={hotel.pricePerNight * duration} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ marginTop: 3, color: '#555' }}>
              Total Cost: <strong>${totalCost}</strong>
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Suggestion;
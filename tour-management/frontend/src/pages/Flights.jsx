import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CommonSection from '../shared/CommonSection';
import FlightSearchBar from '../components/FlightSearchBar/FlightSearchBar';
import axios from 'axios';
import FlightCard from '../shared/FlightCard'; // Nếu có component hiển thị tour/chuyến bay
import { BASE_URL } from '../utils/config';
import { Container, Typography, Grid, Box } from '@mui/material';
const Flights = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/flights?page=0`);
        setFlights(res.data.data);
      } catch (err) {
        console.error('Error fetching flights:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  return (
    <>
      <CommonSection title="Search flights" />
      <section>
        <FlightSearchBar
          initialValues={{
            fromPlace: query.get('fromPlace') || '',
            toPlace: query.get('toPlace') || '',
            departDate: query.get('departDate') || '',
            landingDate: query.get('landingDate') || '',
            ticketType: query.get('ticketType') || '',
          }}
        />
      </section>

      <Container>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : flights.length === 0 ? (
          <Typography>No flights found.</Typography>
        ) : (
          <>
            {/* <Typography variant="h6" sx={{ mb: 4, fontWeight: 'bold' }}>
              Explore
            </Typography> */}
            <Grid container spacing={2}>
              {flights.map((flight) => (
                <Grid item xs={12} key={flight._id}>
                  <Box display="flex" justifyContent="center">
                    <Box width="70%">
                      <FlightCard flight={flight} />
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>

          </>
        )}
      </Container>
    </>
  );
};

export default Flights;


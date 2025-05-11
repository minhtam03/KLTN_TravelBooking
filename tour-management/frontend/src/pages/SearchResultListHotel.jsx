import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Grid, Typography, TextField, Select, MenuItem,
  Button, Container, Card, CardContent
} from '@mui/material';
import SearchBarStay from '../shared/SearchBarStay';
import SearchHotelItem from '../components/SearchHotelItem/SearchHotelItem';
import CommonSection from './../shared/CommonSection';
import { BASE_URL } from '../utils/config';
import { cityList } from '../utils/cities';

const SearchResultListHotel = () => {
  const location = useLocation();
  const {
    data: initialData = [],
    destination: initialDestination = '',
    minPrice = '',
    maxPrice = ''
  } = location.state || {};

  const [data, setData] = useState(initialData);
  const [destination, setDestination] = useState(initialDestination);
  const [min, setMin] = useState(minPrice);
  const [max, setMax] = useState(maxPrice);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/hotels/search/getHotelBySearch`, {
        params: {
          location: destination,
          minPrice: min || 0,
          maxPrice: max || 9999,
        },
      });
      setData(res.data.data);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  return (
    <>
      <CommonSection title={"Hotel Search Result"} />
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Grid container spacing={4}>

          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>Search</Typography>

                <Box mb={2}>
                  {/* <TextField
                    label="Destination"
                    fullWidth
                    variant="standard"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  /> */}
                  <Select
                    fullWidth
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    variant="standard"
                    displayEmpty
                    renderValue={(selected) => selected || "Where are you going?"}
                    sx={{
                      fontFamily: 'Mulish',
                      fontSize: '0.85rem',
                      '& .MuiSelect-root': {
                        color: destination ? 'inherit' : '#999',
                      },
                      '& .MuiInputBase-input': {
                        color: destination ? 'inherit' : '#999',
                      },
                      '& .MuiInput-underline:after': {
                        borderBottomColor: '#ccc',
                      },
                      '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                        borderBottomColor: '#999',
                      },
                      '& .MuiInput-underline:before': {
                        borderBottomColor: '#ccc',
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>Where are you going?</em>
                    </MenuItem>
                    {cityList.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>

                <Box mb={2}>
                  <TextField
                    label="Min price (per night)"
                    type="number"
                    fullWidth
                    variant="standard"
                    value={min}
                    onChange={(e) => setMin(e.target.value)}
                  />
                </Box>

                <Box mb={4}>
                  <TextField
                    label="Max price (per night)"
                    type="number"
                    fullWidth
                    variant="standard"
                    value={max}
                    onChange={(e) => setMax(e.target.value)}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{ borderRadius: 1 }}>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: 'rgb(186, 141, 176)', '&:hover': { backgroundColor: 'rgb(176, 114, 175)' }, px: 4 }}
                      onClick={handleSearch}
                    >
                      Search
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            {data.length === 0 ? (
              <Typography variant="h6" align="center">No hotel found</Typography>
            ) : (
              <Grid container spacing={2}>
                {data.map(hotel => (
                  <Grid item xs={12} key={hotel._id}>
                    <SearchHotelItem hotel={hotel} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default SearchResultListHotel;

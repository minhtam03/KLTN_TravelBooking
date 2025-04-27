import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Grid
} from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { BASE_URL } from "../utils/config";

const SearchBarStay = () => {
  const [destination, setDestination] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!destination.trim()) {
      alert('Please enter destination');
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/hotels/search/getHotelBySearch`, {
        params: {
          location: destination,
          minPrice: parseInt(minPrice) || 0,
          maxPrice: parseInt(maxPrice) || 9999999
        }
      });

      navigate("/stays/search", {
        state: {
          data: res.data.data,
          destination,
          minPrice,
          maxPrice
        }
      });
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const inputFieldStyle = {
    fontFamily: 'Mulish',
    fontSize: '0.85rem',
    ml: 3,
    '& input': {
      fontFamily: 'Mulish',
      fontSize: '0.85rem',
    },
    '& input::placeholder': {
      fontFamily: 'Mulish',
      fontSize: '0.85rem',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#ccc'
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
      borderBottomColor: '#999',
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: '#ccc',
    },
  };

  return (
    <Box
      sx={{
        p: 2,
        px: 3,
        borderRadius: '10px',
        boxShadow: '0 12px 30px rgba(0, 128, 255, 0.2)',
        width: '100%',
        maxWidth: '1000px',
        mt: 1,
        mb: 5,
        mx: 'auto',
        fontFamily: 'Mulish, sans-serif',
        bgcolor: 'white',
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Destination */}
        <Grid item xs={12} sm={6} md={3}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <HotelIcon sx={{ color: '#ee6e6e', fontSize: 20 }} />
            <Typography variant="body1" fontWeight={700} fontFamily="Mulish">
              Destination
            </Typography>
          </Box>
          <TextField
            fullWidth
            placeholder="Where are you going?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            variant="standard"
            sx={inputFieldStyle}
          />
        </Grid>

        {/* Min Price */}
        <Grid item xs={12} sm={6} md={3}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <AttachMoneyIcon sx={{ color: '#ee6e6e', fontSize: 20 }} />
            <Typography variant="body1" fontWeight={700} fontFamily="Mulish">
              Min Price
            </Typography>
          </Box>
          <TextField
            fullWidth
            type="number"
            placeholder="Minimum price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            variant="standard"
            sx={inputFieldStyle}
          />
        </Grid>

        {/* Max Price */}
        <Grid item xs={12} sm={6} md={3}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <AttachMoneyIcon sx={{ color: '#ee6e6e', fontSize: 20 }} />
            <Typography variant="body1" fontWeight={700} fontFamily="Mulish">
              Max Price
            </Typography>
          </Box>
          <TextField
            fullWidth
            type="number"
            placeholder="Maximum price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            variant="standard"
            sx={inputFieldStyle}
          />
        </Grid>

        {/* Search Button */}
        <Grid item xs={12} sm={6} md={3} textAlign="center">
          <IconButton
            onClick={handleSearch}
            sx={{
              backgroundColor: '#7bbcb0',
              color: '#fff',
              borderRadius: '10px 5px 10px 5px',
              '&:hover': {
                backgroundColor: '#69afa3'
              },
            }}
          >
            <SearchIcon sx={{ fontSize: 24 }} />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchBarStay;


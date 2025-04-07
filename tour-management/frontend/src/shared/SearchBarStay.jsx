// import React from 'react'
// import { Container } from 'reactstrap'
// import { faBed } from "@fortawesome/free-solid-svg-icons/faBed";
// import { faDollarSign } from "@fortawesome/free-solid-svg-icons/faDollarSign";
// import { faCalendarDays } from "@fortawesome/free-solid-svg-icons/faCalendarDays";
// import { faPerson } from "@fortawesome/free-solid-svg-icons/faPerson";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { DateRange } from "react-date-range";
// import "react-date-range/dist/styles.css"; // main css file
// import "react-date-range/dist/theme/default.css"; // theme css file
// import { useContext, useState } from "react";
// import { format } from "date-fns";
// import { useNavigate } from "react-router-dom";
// import './search-bar-stay.css'
// import axios from 'axios';
// import { BASE_URL } from '../utils/config';

// const SearchBarStay = () => {
//   const [destination, setDestination] = useState("");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   // const [openDate, setOpenDate] = useState(false);
//   // const [dates, setDates] = useState([
//   //   {
//   //     startDate: new Date(),
//   //     endDate: new Date(),
//   //     key: "selection",
//   //   },
//   // ]);
//   // const [openOptions, setOpenOptions] = useState(false);
//   // const [options, setOptions] = useState({
//   //   adult: 1,
//   //   children: 0,
//   //   room: 1,
//   // });

//   const navigate = useNavigate();
//   // const { user } = useContext(AuthContext);


//   // const handleOption = (name, operation) => {
//   //   setOptions((prev) => {
//   //     return {
//   //       ...prev,
//   //       [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
//   //     };
//   //   });
//   // };

//   // const { dispatch } = useContext(SearchContext);

//   // const handleSearch = () => {
//   //   // dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options } });
//   //   navigate("/hotels", { state: { destination, dates, options } });
//   // };

//   const handleSearch = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/hotels/search/getHotelBySearch`, {
//         params: {
//           location: destination,
//           minPrice: minPrice || 0,
//           maxPrice: maxPrice || 9999
//         }
//       });

//       navigate("/stays/search", {
//         state: {
//           data: res.data.data,
//           destination,
//           minPrice,
//           maxPrice
//         }
//       });
//     } catch (err) {
//       console.error("Search failed:", err);
//     }
//   };

//   return (
//     <div className="headerSearch">
//       <div className="headerSearchItem">
//         <FontAwesomeIcon icon={faBed} className="headerIcon" />
//         <input
//           type="text"
//           placeholder="Where are you going?"
//           className="headerSearchInput"
//           onChange={(e) => setDestination(e.target.value)}
//         />
//       </div>
//       <div className="headerSearchItem">
//         <FontAwesomeIcon icon={faDollarSign} className="headerIcon" />
//         <input
//           type="number"
//           placeholder="Min price"
//           className="headerSearchInput"
//           value={minPrice}
//           onChange={(e) => setMinPrice(e.target.value)}
//         />
//       </div>

//       <div className="headerSearchItem">
//         <FontAwesomeIcon icon={faDollarSign} className="headerIcon" />
//         <input
//           type="number"
//           placeholder="Max price"
//           className="headerSearchInput"
//           value={maxPrice}
//           onChange={(e) => setMaxPrice(e.target.value)}
//         />
//       </div>
//       <div className="headerSearchItem">
//         <button className="headerBtn" onClick={handleSearch}>
//           Search
//         </button>
//       </div>
//     </div>
//   )

// }

// export default SearchBarStay

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  Grid,
  Paper,
  Typography
} from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import axios from "axios";
import { BASE_URL } from "../utils/config";

const SearchBarStay = () => {
  const [destination, setDestination] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/hotels/search/getHotelBySearch`, {
        params: {
          location: destination,
          minPrice: minPrice || 0,
          maxPrice: maxPrice || 9999
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

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        maxWidth: 1100,       // ✨ Giống như SearchHotelItem dùng Card bên trong Grid
        width: "50%",
        mx: "auto",           // Căn giữa

      }}
    >


      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Where are you going?"
            variant="outlined"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}

            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HotelIcon sx={{ color: "#1976d2" }} />
                </InputAdornment>
              )
            }}
          />
        </Grid>

        <Grid item xs={6} md={3}>
          <TextField
            fullWidth
            label="Min Price"
            type="number"
            variant="outlined"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoneyIcon sx={{ color: "#1976d2" }} />
                </InputAdornment>
              )
            }}
          />
        </Grid>

        <Grid item xs={6} md={3}>
          <TextField
            fullWidth
            label="Max Price"
            type="number"
            variant="outlined"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoneyIcon sx={{ color: "#1976d2" }} />
                </InputAdornment>
              )
            }}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSearch}
            sx={{
              height: "100%",
              backgroundColor: "#7bbcb0",
              color: "#ffffff",
              '&:hover': {
                backgroundColor: "#69afa3"
              }
            }}
          >
            Search
          </Button>

        </Grid>
      </Grid>
    </Paper>
  );
};

export default SearchBarStay;

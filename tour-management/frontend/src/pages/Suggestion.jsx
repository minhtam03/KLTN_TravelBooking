// import React, { useState, useEffect, useContext } from 'react';
// import { Button, Box, CircularProgress, Container, Grid } from '@mui/material';
// import { BASE_URL } from '../utils/config';
// import CommonSection from '../shared/CommonSection';
// import { AuthContext } from '../context/AuthContext';
// import SuggestionForm from '../components/Suggestion/SuggestionForm';
// import SuggestionResult from '../components/Suggestion/SuggestionResult';

// const Suggestion = () => {
//   const { user } = useContext(AuthContext);
//   const userId = user?._id || '';
//   const [budget, setBudget] = useState('');
//   const [duration, setDuration] = useState('');
//   const [departure, setDeparture] = useState('');
//   const [destination, setDestination] = useState('');
//   const [startDate, setStartDate] = useState('');

//   const [results, setResults] = useState({
//     tours: [],
//     flights: [],
//     flightsReturn: [],
//     hotels: []
//   });
//   const [loading, setLoading] = useState(false);
//   const [selectedTour, setSelectedTour] = useState(null);
//   const [selectedFlight, setSelectedFlight] = useState(null);
//   const [selectedReturnFlight, setSelectedReturnFlight] = useState(null);
//   const [selectedHotel, setSelectedHotel] = useState(null);
//   const [totalCost, setTotalCost] = useState(0);
//   const [reason, setReason] = useState('');

//   useEffect(() => {
//     if (destination && results.tours?.length > 0) setSelectedTour(results.tours[0]);
//     if (destination && results.flights?.length > 0) setSelectedFlight(results.flights[0]);
//     if (destination && results.flightsReturn?.length > 0) setSelectedReturnFlight(results.flightsReturn[0]);
//     if (destination && results.hotels?.length > 0) setSelectedHotel(results.hotels[0]);

//     const hasValidResults =
//       results.tours?.length > 0 &&
//       results.flights?.length > 0 &&
//       results.flightsReturn?.length > 0 &&
//       results.hotels?.length > 0;

//     // if (!destination) {
//     //   setSelectedTour(null);
//     //   setSelectedFlight(null);
//     //   setSelectedReturnFlight(null);
//     //   setSelectedHotel(null);
//     //   setTotalCost(0);
//     //   return;
//     // }

//     if (!destination) {
//       if (results.tours?.length > 0) {
//         const firstTour = results.tours[0];
//         setSelectedTour(firstTour);

//         const city = firstTour.city;

//         const flightGo = results.flights.find(f => f.toPlace === city);
//         const flightBack = results.flightsReturn.find(f => f.fromPlace === city);
//         const hotel = results.hotels.find(h => h.location === city);

//         setSelectedFlight(flightGo || null);
//         setSelectedReturnFlight(flightBack || null);
//         setSelectedHotel(hotel || null);

//         const total = (firstTour.price || 0)
//           + (flightGo?.totalPriceUSD || 0)
//           + (flightBack?.totalPriceUSD || 0)
//           + ((hotel?.pricePerNight || 0) * duration);

//         setTotalCost(!isNaN(total) ? total : 0);
//       } else {
//         // không có tour → reset tất cả
//         setSelectedTour(null);
//         setSelectedFlight(null);
//         setSelectedReturnFlight(null);
//         setSelectedHotel(null);
//         setTotalCost(0);
//       }
//       return;
//     }

//     if (hasValidResults) {
//       const initialTotal =
//         (results.tours[0].price || 0) +
//         (results.flights[0].totalPriceUSD || 0) +
//         (results.flightsReturn[0].totalPriceUSD || 0) +
//         (results.hotels[0].pricePerNight || 0) * duration;
//       setTotalCost(!isNaN(initialTotal) ? initialTotal : 0);
//     } else {
//       setTotalCost(0);
//     }
//   }, [results, duration, destination]);

//   const handleSubmit = async () => {
//     setTotalCost(0);
//     setSelectedTour(null);
//     setSelectedFlight(null);
//     setSelectedReturnFlight(null);
//     setSelectedHotel(null);
//     setReason('');

//     if (!budget || !duration || !departure || !startDate) {
//       return alert('Please fill in fields!');
//     }
//     if (budget <= 0) {
//       return alert('Budget must be greater than 0!');
//     }

//     setLoading(true);
//     try {
//       const response = await fetch(`${BASE_URL}/suggestions/suggest`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ budget, duration, departure, destination, startDate, userId }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         setResults({ tours: [], flights: [], flightsReturn: [], hotels: [] });
//         setSelectedTour(null);
//         setSelectedFlight(null);
//         setSelectedReturnFlight(null);
//         setSelectedHotel(null);
//         setTotalCost(0);
//         if (response.status === 404) {
//           alert('No options found within your budget.');
//         } else {
//           alert('An error occurred while fetching suggestions.');
//         }
//         return;
//       }

//       const data = await response.json();
//       setReason(data.reason || '');

//       const uniqueTours = Array.from(new Map(data.options.map((item) => [item.tour.title, item.tour])).values());
//       const uniqueFlights = Array.from(new Map(data.options.map((item) => [item.flightGo.flightNumber, item.flightGo])).values());
//       const uniqueFlightsReturn = Array.from(new Map(data.options.map((item) => [item.flightBack.flightNumber, item.flightBack])).values());
//       const uniqueHotels = Array.from(new Map(data.options.map((item) => [item.hotel.hotelName, item.hotel])).values());

//       setResults({ tours: uniqueTours, flights: uniqueFlights, flightsReturn: uniqueFlightsReturn, hotels: uniqueHotels });
//     } catch (error) {
//       console.error('Error fetching data', error);
//       alert('An error occurred. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelect = (type, value) => {
//     let newTour = selectedTour;
//     let newFlight = selectedFlight;
//     let newReturnFlight = selectedReturnFlight;
//     let newHotel = selectedHotel;

//     // if (type === 'tour') newTour = value;
//     if (type === 'tour') {
//       newTour = value;

//       if (!destination && value) {
//         const city = value.city;

//         newFlight = results.flights.find(f => f.toPlace === city) || null;
//         newReturnFlight = results.flightsReturn.find(f => f.fromPlace === city) || null;
//         newHotel = results.hotels.find(h => h.location === city) || null;
//       }
//     }
//     if (type === 'flight') newFlight = value;
//     if (type === 'returnFlight') newReturnFlight = value;
//     if (type === 'hotel') newHotel = value;



//     setSelectedTour(newTour);
//     setSelectedFlight(newFlight);
//     setSelectedReturnFlight(newReturnFlight);
//     setSelectedHotel(newHotel);

//     const total =
//       (newTour?.price || 0) +
//       (newFlight?.totalPriceUSD || 0) +
//       (newReturnFlight?.totalPriceUSD || 0) +
//       (newHotel?.pricePerNight * duration || 0);

//     setTotalCost(total);
//   };


//   const isOptionDisabled = (type, option) => {
//     let tempTotalCost = 0;

//     if (type === 'tour') {
//       tempTotalCost =
//         (option?.price || 0) +
//         (selectedFlight?.totalPriceUSD || 0) +
//         (selectedReturnFlight?.totalPriceUSD || 0) +
//         (selectedHotel?.pricePerNight * duration || 0);
//     } else if (type === 'flight') {
//       tempTotalCost =
//         (selectedTour?.price || 0) +
//         (option?.totalPriceUSD || 0) +
//         (selectedReturnFlight?.totalPriceUSD || 0) +
//         (selectedHotel?.pricePerNight * duration || 0);
//     } else if (type === 'returnFlight') {
//       tempTotalCost =
//         (selectedTour?.price || 0) +
//         (selectedFlight?.totalPriceUSD || 0) +
//         (option?.totalPriceUSD || 0) +
//         (selectedHotel?.pricePerNight * duration || 0);
//     } else if (type === 'hotel') {
//       tempTotalCost =
//         (selectedTour?.price || 0) +
//         (selectedFlight?.totalPriceUSD || 0) +
//         (selectedReturnFlight?.totalPriceUSD || 0) +
//         (option?.pricePerNight * duration || 0);
//     }

//     return tempTotalCost > budget;
//   };

//   return (
//     <>
//       <CommonSection title={'Suggestion'} />

//       <Box sx={{ px: 4, py: 5 }}>
//         <Grid container spacing={0}>
//           <Grid item xs={12} md={6}>
//             <Box sx={{ borderRadius: 2, p: 3, mt: 5 }}>
//               <SuggestionForm
//                 budget={budget} setBudget={setBudget}
//                 duration={duration} setDuration={setDuration}
//                 departure={departure} setDeparture={setDeparture}
//                 destination={destination} setDestination={setDestination}
//                 startDate={startDate} setStartDate={setStartDate}
//                 loading={loading}
//                 reason={reason}
//                 variant="standard"
//               />
//               <Box sx={{ display: "flex", justifyContent: "center", mt: 8, ml: 5 }}>
//                 <Button
//                   data-testid="input-suggest"
//                   variant="contained"
//                   color="primary"
//                   sx={{ backgroundColor: 'var(--secondary-color)', fontWeight: 'bold', textTransform: 'none', '&:hover': { backgroundColor: '#71aea3' } }}
//                   onClick={handleSubmit}
//                   disabled={loading}
//                 >
//                   {loading ? <CircularProgress size={20} color="inherit" /> : 'Suggest'}
//                 </Button>
//               </Box>
//             </Box>
//           </Grid>

//           <Grid item xs={12} md={4}>
//             <SuggestionResult
//               results={results}
//               selectedTour={selectedTour}
//               selectedFlight={selectedFlight}
//               selectedReturnFlight={selectedReturnFlight}
//               selectedHotel={selectedHotel}
//               duration={duration}
//               handleSelect={handleSelect}
//               isOptionDisabled={isOptionDisabled}
//               totalCost={totalCost}
//               reason={reason}
//               destination={destination}
//             />
//           </Grid>
//         </Grid>
//       </Box>
//     </>
//   );
// };

// export default Suggestion;

import React, { useState, useEffect, useContext } from 'react';
import { Button, Box, CircularProgress, Grid } from '@mui/material';
import { Snackbar, Alert } from '@mui/material';
import Slide from '@mui/material/Slide';
import { BASE_URL } from '../utils/config';
import CommonSection from '../shared/CommonSection';
import { AuthContext } from '../context/AuthContext';
import SuggestionForm from '../components/Suggestion/SuggestionForm';
import SuggestionResult from '../components/Suggestion/SuggestionResult';

const Suggestion = () => {
  const { user } = useContext(AuthContext);
  const userId = user?._id || '';
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('');
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const [results, setResults] = useState({
    tours: [],
    flights: [],
    flightsReturn: [],
    hotels: []
  });
  const [loading, setLoading] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (destination && results.tours?.length > 0) setSelectedTour(results.tours[0]);
    if (destination && results.flights?.length > 0) setSelectedFlight(results.flights[0]);
    if (destination && results.flightsReturn?.length > 0) setSelectedReturnFlight(results.flightsReturn[0]);
    if (destination && results.hotels?.length > 0) setSelectedHotel(results.hotels[0]);

    if (!destination) {
      if (results.tours?.length > 0) {
        const firstTour = results.tours[0];
        setSelectedTour(firstTour);
        const city = firstTour.city;

        const flightGo = results.flights.find(f => f.toPlace === city) || null;
        const flightBack = results.flightsReturn.find(f => f.fromPlace === city) || null;
        const hotel = results.hotels.find(h => h.location === city) || null;

        setSelectedFlight(flightGo);
        setSelectedReturnFlight(flightBack);
        setSelectedHotel(hotel);

        const total = (firstTour.price || 0)
          + (flightGo?.totalPriceUSD || 0)
          + (flightBack?.totalPriceUSD || 0)
          + ((hotel?.pricePerNight || 0) * duration);

        setTotalCost(!isNaN(total) ? total : 0);
      } else {
        setSelectedTour(null);
        setSelectedFlight(null);
        setSelectedReturnFlight(null);
        setSelectedHotel(null);
        setTotalCost(0);
      }
      return;
    }

    // const hasValidResults =
    //   results.tours?.length > 0
    //   &&
    //   results.flights?.length > 0 &&
    //   results.flightsReturn?.length > 0 &&
    //   results.hotels?.length > 0;
    const hasValidResults = results.tours?.length > 0;

    // if (hasValidResults) {
    //   const initialTotal =
    //     (results.tours[0].price || 0) +
    //     (results.flights[0].totalPriceUSD || 0) +
    //     (results.flightsReturn[0].totalPriceUSD || 0) +
    //     (results.hotels[0].pricePerNight || 0) * duration;
    //   setTotalCost(!isNaN(initialTotal) ? initialTotal : 0);
    // } else {
    //   setTotalCost(0);
    // }
    if (hasValidResults) {
      const tourPrice = results.tours[0]?.price || 0;
      const flightPrice = results.flights?.[0]?.totalPriceUSD || 0;
      const returnFlightPrice = results.flightsReturn?.[0]?.totalPriceUSD || 0;
      const hotelPricePerNight = results.hotels?.[0]?.pricePerNight || 0;

      const initialTotal =
        tourPrice +
        flightPrice +
        returnFlightPrice +
        hotelPricePerNight * duration;

      setTotalCost(!isNaN(initialTotal) ? initialTotal : 0);
    } else {
      setTotalCost(0);
    }
  }, [results, duration, destination]);

  const handleSubmit = async () => {
    setTotalCost(0);
    setSelectedTour(null);
    setSelectedFlight(null);
    setSelectedReturnFlight(null);
    setSelectedHotel(null);
    setReason('');

    if (!budget || !duration || !departure || !startDate) {
      showSnackbar('Please fill in all required fields!', 'warning');
      return;
    }
    if (budget <= 0) {
      showSnackbar('Budget must be greater than 0!', 'warning');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/suggestions/suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget, duration, departure, destination, startDate, userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setResults({ tours: [], flights: [], flightsReturn: [], hotels: [] });
        setSelectedTour(null);
        setSelectedFlight(null);
        setSelectedReturnFlight(null);
        setSelectedHotel(null);
        setTotalCost(0);
        if (response.status === 404) {
          showSnackbar('No suitable options available.', 'info');
        } else {
          showSnackbar('An error occurred while fetching suggestions.', 'error');
        }
        return;
      }

      const data = await response.json();
      setReason(data.reason || '');

      const uniqueTours = Array.from(new Map(data.options.map((item) => [item.tour.title, item.tour])).values());
      const uniqueFlights = Array.from(new Map(data.options.map((item) => [item.flightGo?.flightNumber, item.flightGo])).values()).filter(Boolean);
      const uniqueFlightsReturn = Array.from(new Map(data.options.map((item) => [item.flightBack?.flightNumber, item.flightBack])).values()).filter(Boolean);
      const uniqueHotels = Array.from(new Map(data.options.map((item) => [item.hotel?.hotelName, item.hotel])).values()).filter(Boolean);

      setResults({ tours: uniqueTours, flights: uniqueFlights, flightsReturn: uniqueFlightsReturn, hotels: uniqueHotels });
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
    let newReturnFlight = selectedReturnFlight;
    let newHotel = selectedHotel;

    if (type === 'tour') {
      newTour = value;

      if (!destination && value) {
        const city = value.city;

        newFlight = results.flights.find(f => f.toPlace === city) || null;
        newReturnFlight = results.flightsReturn.find(f => f.fromPlace === city) || null;
        newHotel = results.hotels.find(h => h.location === city) || null;

        setSelectedFlight(newFlight);
        setSelectedReturnFlight(newReturnFlight);
        setSelectedHotel(newHotel);
      }
    }
    if (type === 'flight') newFlight = value;
    if (type === 'returnFlight') newReturnFlight = value;
    if (type === 'hotel') newHotel = value;

    setSelectedTour(newTour);
    setSelectedFlight(newFlight);
    setSelectedReturnFlight(newReturnFlight);
    setSelectedHotel(newHotel);

    const total =
      (newTour?.price || 0) +
      (newFlight?.totalPriceUSD || 0) +
      (newReturnFlight?.totalPriceUSD || 0) +
      (newHotel?.pricePerNight * duration || 0);

    setTotalCost(total);
  };

  const isOptionDisabled = (type, option) => {
    let tempTotalCost = 0;

    if (type === 'tour') {
      tempTotalCost =
        (option?.price || 0) +
        (selectedFlight?.totalPriceUSD || 0) +
        (selectedReturnFlight?.totalPriceUSD || 0) +
        (selectedHotel?.pricePerNight * duration || 0);
    } else if (type === 'flight') {
      tempTotalCost =
        (selectedTour?.price || 0) +
        (option?.totalPriceUSD || 0) +
        (selectedReturnFlight?.totalPriceUSD || 0) +
        (selectedHotel?.pricePerNight * duration || 0);
    } else if (type === 'returnFlight') {
      tempTotalCost =
        (selectedTour?.price || 0) +
        (selectedFlight?.totalPriceUSD || 0) +
        (option?.totalPriceUSD || 0) +
        (selectedHotel?.pricePerNight * duration || 0);
    } else if (type === 'hotel') {
      tempTotalCost =
        (selectedTour?.price || 0) +
        (selectedFlight?.totalPriceUSD || 0) +
        (selectedReturnFlight?.totalPriceUSD || 0) +
        (option?.pricePerNight * duration || 0);
    }

    return tempTotalCost > budget;
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const SlideTransition = (props) => {
    return <Slide {...props} direction="down" />;
  };

  return (
    <>
      <CommonSection title={'Suggestion'} />

      <Box sx={{ px: 4, py: 5 }}>
        <Grid container spacing={0}>
          <Grid item xs={12} md={6}>
            <Box sx={{ borderRadius: 2, p: 3, mt: 5 }}>
              <SuggestionForm
                budget={budget} setBudget={setBudget}
                duration={duration} setDuration={setDuration}
                departure={departure} setDeparture={setDeparture}
                destination={destination} setDestination={setDestination}
                startDate={startDate} setStartDate={setStartDate}
                loading={loading}
                reason={reason}
                variant="standard"
              />
              <Box sx={{ display: "flex", justifyContent: "center", mt: 8, ml: 28 }}>
                <Button
                  data-testid="input-suggest"
                  variant="contained"
                  color="primary"
                  sx={{ backgroundColor: 'var(--secondary-color)', fontWeight: 'bold', textTransform: 'none', '&:hover': { backgroundColor: '#71aea3' } }}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={20} color="inherit" /> : 'Suggest'}
                </Button>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <SuggestionResult
              results={results}
              selectedTour={selectedTour}
              selectedFlight={selectedFlight}
              selectedReturnFlight={selectedReturnFlight}
              selectedHotel={selectedHotel}
              duration={duration}
              handleSelect={handleSelect}
              isOptionDisabled={isOptionDisabled}
              totalCost={totalCost}
              reason={reason}
              destination={destination}
            />
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={SlideTransition}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}
          sx={{ width: '100%', fontSize: '1.1rem' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Suggestion;

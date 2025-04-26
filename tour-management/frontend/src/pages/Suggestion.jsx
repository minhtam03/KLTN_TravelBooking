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
//     hotels: []
//   });
//   const [loading, setLoading] = useState(false);
//   const [selectedTour, setSelectedTour] = useState(null);
//   const [selectedFlight, setSelectedFlight] = useState(null);
//   const [selectedHotel, setSelectedHotel] = useState(null);
//   const [totalCost, setTotalCost] = useState(0);
//   const [reason, setReason] = useState('');


//   useEffect(() => {
//     // Giữ logic tự chọn nếu có destination
//     if (destination && results.tours?.length > 0) setSelectedTour(results.tours[0]);
//     if (destination && results.flights?.length > 0) setSelectedFlight(results.flights[0]);
//     if (destination && results.hotels?.length > 0) setSelectedHotel(results.hotels[0]);

//     const hasValidResults =
//       results.tours?.length > 0 &&
//       results.flights?.length > 0 &&
//       results.hotels?.length > 0;

//     if (!destination) {
//       setSelectedTour(null);
//       setSelectedFlight(null);
//       setSelectedHotel(null);
//       setTotalCost(0);
//       return;
//     }

//     if (hasValidResults) {
//       const initialTotal =
//         (results.tours[0].price || 0) +
//         (results.flights[0].price || 0) +
//         (results.hotels[0].pricePerNight || 0) * duration;

//       setTotalCost(!isNaN(initialTotal) ? initialTotal : 0);
//     } else {
//       setTotalCost(0);
//     }
//   }, [results, duration, destination]);

//   const isOptionDisabled = (type, option) => {
//     let tempTotalCost = totalCost;

//     if (type === 'tour') {
//       tempTotalCost = (option?.price || 0) + (selectedFlight?.price || 0) + (selectedHotel?.pricePerNight * duration || 0);
//     } else if (type === 'flight') {
//       tempTotalCost = (selectedTour?.price || 0) + (option?.price || 0) + (selectedHotel?.pricePerNight * duration || 0);
//     } else if (type === 'hotel') {
//       tempTotalCost = (selectedTour?.price || 0) + (selectedFlight?.price || 0) + (option?.pricePerNight * duration || 0);
//     }

//     return tempTotalCost > budget;
//   };

//   const handleSubmit = async () => {
//     setTotalCost(0);
//     setSelectedTour(null);
//     setSelectedFlight(null);
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
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ budget, duration, departure, destination, startDate, userId }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 404) {
//           alert('No options found within your budget.');
//         } else {
//           alert('An error occurred while fetching suggestions.');
//         }
//         return;
//       }

//       const data = await response.json();
//       setReason(data.reason || '');

//       const uniqueTours = Array.from(
//         new Map(data.options.map((item) => [item.tour.title, item.tour])).values()
//       );
//       const uniqueFlights = Array.from(
//         new Map(data.options.map((item) => [item.flight.flightNumber, item.flight])).values()
//       );
//       const uniqueHotels = Array.from(
//         new Map(data.options.map((item) => [item.hotel.hotelName, item.hotel])).values()
//       );


//       setResults({ tours: uniqueTours, flights: uniqueFlights, hotels: uniqueHotels });
//     } catch (error) {
//       console.error('Error fetching data', error);
//       alert('An error occurred. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelect = (type, value) => {
//     const flights = results.flights || [];
//     const hotels = results.hotels || [];
//     const tours = results.tours || [];

//     let newTour = selectedTour;
//     let newFlight = selectedFlight;
//     let newHotel = selectedHotel;



//     if (type === 'tour') {
//       newTour = value;
//       const city = newTour.city;

//       // Nếu người dùng không chọn destination → reset flight & hotel
//       if (!destination) {
//         newFlight = null;
//         newHotel = null;
//       } else {
//         const currentTotal =
//           newTour.price +
//           (selectedFlight?.price || 0) +
//           (selectedHotel?.pricePerNight || 0) * duration;

//         if (currentTotal > budget) {
//           const validFlights = flights.filter(f => f.arrivalCity === city);
//           const validHotels = hotels.filter(h => h.location === city);
//           let best = { total: Infinity, flight: null, hotel: null };

//           for (let f of validFlights) {
//             for (let h of validHotels) {
//               const total = newTour.price + f.price + h.pricePerNight * duration;
//               if (total <= budget && total < best.total) {
//                 best = { total, flight: f, hotel: h };
//               }
//             }
//           }

//           newFlight = best.flight;
//           newHotel = best.hotel;
//         }
//       }

//       setSelectedTour(newTour);
//       setSelectedFlight(newFlight);
//       setSelectedHotel(newHotel);
//     }

//     else if (type === 'flight') {
//       newFlight = value;

//       if (!selectedTour) return;

//       const currentTotal =
//         selectedTour.price + newFlight.price + (selectedHotel?.pricePerNight || 0) * duration;

//       if (currentTotal <= budget) {
//         // Vẫn trong ngân sách → giữ hotel
//       } else {
//         const validHotels = hotels.filter(h => h.location === selectedTour.city);
//         let best = { total: Infinity, hotel: null };

//         for (let h of validHotels) {
//           const total = selectedTour.price + newFlight.price + h.pricePerNight * duration;
//           if (total <= budget && total < best.total) {
//             best = { total, hotel: h };
//           }
//         }

//         newHotel = best.hotel;
//       }

//       setSelectedFlight(newFlight);
//       setSelectedHotel(newHotel);
//     }

//     else if (type === 'hotel') {
//       newHotel = value;

//       if (!selectedTour) return;

//       const currentTotal =
//         selectedTour.price + (selectedFlight?.price || 0) + newHotel.pricePerNight * duration;

//       if (currentTotal <= budget) {
//         // Vẫn trong ngân sách → giữ flight
//       } else {
//         const validFlights = flights.filter(f => f.arrivalCity === selectedTour.city);
//         let best = { total: Infinity, flight: null };

//         for (let f of validFlights) {
//           const total = selectedTour.price + f.price + newHotel.pricePerNight * duration;
//           if (total <= budget && total < best.total) {
//             best = { total, flight: f };
//           }
//         }

//         newFlight = best.flight;
//       }

//       setSelectedHotel(newHotel);
//       setSelectedFlight(newFlight);
//     }

//     // Cập nhật tổng chi phí
//     const total =
//       (newTour?.price || 0) +
//       (newFlight?.price || 0) +
//       (newHotel?.pricePerNight * duration || 0);

//     setTotalCost(total);
//   };



//   return (
//     <>
//       <CommonSection title={'Suggestion'} />

//       <Box sx={{ px: 4, py: 5 }}>


//         <Grid container spacing={0}>
//           {/* Cột 1: Form nhập liệu */}
//           <Grid item xs={12} md={6}>
//             <Box sx={{ borderRadius: 2, p: 3 }}>
//               <SuggestionForm
//                 budget={budget} setBudget={setBudget}
//                 duration={duration} setDuration={setDuration}
//                 departure={departure} setDeparture={setDeparture}
//                 destination={destination} setDestination={setDestination}
//                 startDate={startDate} setStartDate={setStartDate}
//                 loading={loading}
//                 reason={reason}
//                 variant="standard"  // truyền xuống để dùng dạng variant trong SuggestionForm
//               />

//               <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   sx={{
//                     backgroundColor: 'var(--secondary-color)',
//                     fontWeight: 'bold',
//                     textTransform: 'none',
//                     px: 2,
//                     '&:hover': {
//                       backgroundColor: '#71aea3'  // bạn có thể điều chỉnh theo tone màu bạn thích
//                     }
//                   }}
//                   onClick={handleSubmit}
//                   disabled={loading}
//                 >
//                   {loading ? <CircularProgress size={20} color="inherit" /> : 'Suggest'}
//                 </Button>
//               </Box>
//             </Box>
//           </Grid>

//           {/* Cột 2: Kết quả */}
//           <Grid item xs={12} md={4}>
//             <SuggestionResult
//               results={results}
//               selectedTour={selectedTour}
//               selectedFlight={selectedFlight}
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
import { Button, Box, CircularProgress, Container, Grid } from '@mui/material';
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

    const hasValidResults =
      results.tours?.length > 0 &&
      results.flights?.length > 0 &&
      results.flightsReturn?.length > 0 &&
      results.hotels?.length > 0;

    if (!destination) {
      setSelectedTour(null);
      setSelectedFlight(null);
      setSelectedReturnFlight(null);
      setSelectedHotel(null);
      setTotalCost(0);
      return;
    }

    if (hasValidResults) {
      const initialTotal =
        (results.tours[0].price || 0) +
        (results.flights[0].price || 0) +
        (results.flightsReturn[0].price || 0) +
        (results.hotels[0].pricePerNight || 0) * duration;
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
      return alert('Please fill in fields!');
    }
    if (budget <= 0) {
      return alert('Budget must be greater than 0!');
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
        if (response.status === 404) {
          alert('No options found within your budget.');
        } else {
          alert('An error occurred while fetching suggestions.');
        }
        return;
      }

      const data = await response.json();
      setReason(data.reason || '');

      const uniqueTours = Array.from(new Map(data.options.map((item) => [item.tour.title, item.tour])).values());
      const uniqueFlights = Array.from(new Map(data.options.map((item) => [item.flightGo.flightNumber, item.flightGo])).values());
      const uniqueFlightsReturn = Array.from(new Map(data.options.map((item) => [item.flightBack.flightNumber, item.flightBack])).values());
      const uniqueHotels = Array.from(new Map(data.options.map((item) => [item.hotel.hotelName, item.hotel])).values());

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

    if (type === 'tour') newTour = value;
    if (type === 'flight') newFlight = value;
    if (type === 'returnFlight') newReturnFlight = value;
    if (type === 'hotel') newHotel = value;

    setSelectedTour(newTour);
    setSelectedFlight(newFlight);
    setSelectedReturnFlight(newReturnFlight);
    setSelectedHotel(newHotel);

    const total =
      (newTour?.price || 0) +
      (newFlight?.price || 0) +
      (newReturnFlight?.price || 0) +
      (newHotel?.pricePerNight * duration || 0);

    setTotalCost(total);
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
              <Box sx={{ display: "flex", justifyContent: "center", mt: 8, ml: 5 }}>
                <Button
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
              isOptionDisabled={() => false}
              totalCost={totalCost}
              reason={reason}
              destination={destination}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Suggestion;


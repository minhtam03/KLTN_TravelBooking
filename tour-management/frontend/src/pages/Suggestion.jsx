import React, { useState, useEffect, useContext } from 'react';
import { Button, Box, CircularProgress, Container } from '@mui/material';
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
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [reason, setReason] = useState('');


  // useEffect(() => {
  //   if (destination && results.tours?.length > 0) setSelectedTour(results.tours[0]);
  //   if (destination && results.flights?.length > 0) setSelectedFlight(results.flights[0]);
  //   if (destination && results.hotels?.length > 0) setSelectedHotel(results.hotels[0]);
  //   console.log("eee")
  //   // Chỉ tính tổng nếu có ít nhất 1 tour, flight và hotel
  //   if (results.tours?.length > 0 && results.flights?.length > 0 && results.hotels?.length > 0) {
  //     const initialTotal =
  //       (results.tours[0].price || 0) +
  //       (results.flights[0].price || 0) +
  //       (results.hotels[0].pricePerNight || 0) * duration;

  //     setTotalCost(!isNaN(initialTotal) ? initialTotal : 0);
  //     console.log("Aaa")
  //   } else {
  //     // Không có dữ liệu => reset cost
  //     setTotalCost(0);
  //     console.log("aaa")
  //   }
  // }, [results, duration, destination]);

  useEffect(() => {
    // Giữ logic tự chọn nếu có destination
    if (destination && results.tours?.length > 0) setSelectedTour(results.tours[0]);
    if (destination && results.flights?.length > 0) setSelectedFlight(results.flights[0]);
    if (destination && results.hotels?.length > 0) setSelectedHotel(results.hotels[0]);

    const hasValidResults =
      results.tours?.length > 0 &&
      results.flights?.length > 0 &&
      results.hotels?.length > 0;

    if (!destination) {
      setSelectedTour(null);
      setSelectedFlight(null);
      setSelectedHotel(null);
      setTotalCost(0);
      return;
    }

    if (hasValidResults) {
      const initialTotal =
        (results.tours[0].price || 0) +
        (results.flights[0].price || 0) +
        (results.hotels[0].pricePerNight || 0) * duration;

      setTotalCost(!isNaN(initialTotal) ? initialTotal : 0);
    } else {
      setTotalCost(0);
    }
  }, [results, duration, destination]);

  const isOptionDisabled = (type, option) => {
    let tempTotalCost = totalCost;

    if (type === 'tour') {
      tempTotalCost = (option?.price || 0) + (selectedFlight?.price || 0) + (selectedHotel?.pricePerNight * duration || 0);
    } else if (type === 'flight') {
      tempTotalCost = (selectedTour?.price || 0) + (option?.price || 0) + (selectedHotel?.pricePerNight * duration || 0);
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
        headers: {
          'Content-Type': 'application/json',
        },
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
    const flights = results.flights || [];
    const hotels = results.hotels || [];
    const tours = results.tours || [];

    let newTour = selectedTour;
    let newFlight = selectedFlight;
    let newHotel = selectedHotel;

    // if (type === 'tour') {
    //   newTour = value;
    //   const city = newTour.city;
    //   const currentTotal =
    //     newTour.price +
    //     (selectedFlight?.price || 0) +
    //     (selectedHotel?.pricePerNight || 0) * duration;

    //   if (currentTotal <= budget) {
    //     // Vẫn trong ngân sách → giữ nguyên flight + hotel
    //   } else {
    //     // Vượt ngân sách → tìm combo flight + hotel tốt nhất cho tour này
    //     const validFlights = flights.filter(f => f.arrivalCity === city);
    //     const validHotels = hotels.filter(h => h.location === city);
    //     let best = { total: Infinity, flight: null, hotel: null };

    //     for (let f of validFlights) {
    //       for (let h of validHotels) {
    //         const total = newTour.price + f.price + h.pricePerNight * duration;
    //         if (total <= budget && total < best.total) {
    //           best = { total, flight: f, hotel: h };
    //         }
    //       }
    //     }

    //     newFlight = best.flight;
    //     newHotel = best.hotel;
    //   }

    //   setSelectedTour(newTour);
    //   setSelectedFlight(newFlight);
    //   setSelectedHotel(newHotel);
    // }

    if (type === 'tour') {
      newTour = value;
      const city = newTour.city;

      // Nếu người dùng không chọn destination → reset flight & hotel
      if (!destination) {
        newFlight = null;
        newHotel = null;
      } else {
        const currentTotal =
          newTour.price +
          (selectedFlight?.price || 0) +
          (selectedHotel?.pricePerNight || 0) * duration;

        if (currentTotal > budget) {
          const validFlights = flights.filter(f => f.arrivalCity === city);
          const validHotels = hotels.filter(h => h.location === city);
          let best = { total: Infinity, flight: null, hotel: null };

          for (let f of validFlights) {
            for (let h of validHotels) {
              const total = newTour.price + f.price + h.pricePerNight * duration;
              if (total <= budget && total < best.total) {
                best = { total, flight: f, hotel: h };
              }
            }
          }

          newFlight = best.flight;
          newHotel = best.hotel;
        }
      }

      setSelectedTour(newTour);
      setSelectedFlight(newFlight);
      setSelectedHotel(newHotel);
    }

    else if (type === 'flight') {
      newFlight = value;

      if (!selectedTour) return;

      const currentTotal =
        selectedTour.price + newFlight.price + (selectedHotel?.pricePerNight || 0) * duration;

      if (currentTotal <= budget) {
        // Vẫn trong ngân sách → giữ hotel
      } else {
        const validHotels = hotels.filter(h => h.location === selectedTour.city);
        let best = { total: Infinity, hotel: null };

        for (let h of validHotels) {
          const total = selectedTour.price + newFlight.price + h.pricePerNight * duration;
          if (total <= budget && total < best.total) {
            best = { total, hotel: h };
          }
        }

        newHotel = best.hotel;
      }

      setSelectedFlight(newFlight);
      setSelectedHotel(newHotel);
    }

    else if (type === 'hotel') {
      newHotel = value;

      if (!selectedTour) return;

      const currentTotal =
        selectedTour.price + (selectedFlight?.price || 0) + newHotel.pricePerNight * duration;

      if (currentTotal <= budget) {
        // Vẫn trong ngân sách → giữ flight
      } else {
        const validFlights = flights.filter(f => f.arrivalCity === selectedTour.city);
        let best = { total: Infinity, flight: null };

        for (let f of validFlights) {
          const total = selectedTour.price + f.price + newHotel.pricePerNight * duration;
          if (total <= budget && total < best.total) {
            best = { total, flight: f };
          }
        }

        newFlight = best.flight;
      }

      setSelectedHotel(newHotel);
      setSelectedFlight(newFlight);
    }

    // Cập nhật tổng chi phí
    const total =
      (newTour?.price || 0) +
      (newFlight?.price || 0) +
      (newHotel?.pricePerNight * duration || 0);

    setTotalCost(total);
  };



  return (
    <>
      <CommonSection title={'Suggestion'} />
      <Box sx={{ padding: 4, backgroundColor: '#f9f9f9', borderRadius: 2, width: "75%", mx: "auto" }}>
        <SuggestionForm
          budget={budget} setBudget={setBudget}
          duration={duration} setDuration={setDuration}
          departure={departure} setDeparture={setDeparture}
          destination={destination} setDestination={setDestination}
          startDate={startDate} setStartDate={setStartDate}
          loading={loading}
          reason={reason}
        />

        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 2, fontWeight: 'bold', fontSize: '1rem', padding: '0.75rem' }}
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Suggest'}
        </Button>

        {results.tours?.length > 0 && (
          <Box sx={{ marginTop: 3 }}>
            <SuggestionResult
              results={results}
              selectedTour={selectedTour}
              selectedFlight={selectedFlight}
              selectedHotel={selectedHotel}
              duration={duration}
              handleSelect={handleSelect}
              isOptionDisabled={isOptionDisabled}
              totalCost={totalCost}
              reason={reason}
              destination={destination}
            />
          </Box>
        )}
      </Box>
    </>
  );
};

export default Suggestion;

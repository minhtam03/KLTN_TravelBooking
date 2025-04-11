// // pages/SearchResultListFlight.jsx
// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { BASE_URL } from '../utils/config';
// import FlightCard from '../shared/FlightCard'; // component hiển thị thông tin chuyến bay

// import CommonSection from '../shared/CommonSection';
// import { Container, Typography, Grid, Box } from '@mui/material';

// const SearchResultListFlight = () => {
//     const location = useLocation();
//     const [flights, setFlights] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const queryParams = new URLSearchParams(location.search);
//     const departureCity = queryParams.get('departureCity');
//     const arrivalCity = queryParams.get('arrivalCity');
//     const departureDate = queryParams.get('departureDate');
//     const returnDate = queryParams.get('returnDate');
//     const flightClass = queryParams.get('class');
//     const tripType = queryParams.get('tripType');

//     useEffect(() => {
//         const fetchFlights = async () => {
//             try {
//                 const query = new URLSearchParams({
//                     tripType,
//                     departureCity,
//                     arrivalCity,
//                     departureDate,
//                     flightClass,
//                 });

//                 if (tripType === 'round-trip') {
//                     query.append('returnDate', returnDate);
//                 }

//                 const res = await fetch(`${BASE_URL}/flights/search/filter?${query.toString()}`);
//                 const data = await res.json();

//                 if (data.success) {
//                     setFlights(data.data);
//                 } else {
//                     alert('No flights found!');
//                 }
//             } catch (error) {
//                 console.error('Error fetching flights:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchFlights();
//     }, [departureCity, arrivalCity, departureDate, returnDate, flightClass, tripType]);

//     return (
//         <>
//             <CommonSection title={"Flight Search Result"} />
//             <Container className="pt-5">
//                 {loading ? (
//                     <p>Loading...</p>
//                 ) : flights.length > 0 ? (
//                     <Grid container spacing={3}>
//                         {flights.map((flight) => (
//                             <Grid item xs={12} key={flight._id}>
//                                 <Box display="flex" justifyContent="center">
//                                     <Box width="70%">
//                                         <FlightCard flight={flight} />
//                                     </Box>
//                                 </Box>
//                             </Grid>
//                         ))}
//                     </Grid>
//                 ) : (
//                     <p>No flights found.</p>
//                 )}
//             </Container>
//         </>

//     );
// };

// export default SearchResultListFlight;

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BASE_URL } from '../utils/config';
import FlightCard from '../shared/FlightCard';
import CommonSection from '../shared/CommonSection';
import FlightSearchBar from '../components/FlightSearchBar/FlightSearchBar';
import { Container, Typography, Grid, Box } from '@mui/material';

const SearchResultListFlight = () => {
    const location = useLocation();
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);

    const queryParams = new URLSearchParams(location.search);
    const tripType = queryParams.get('tripType');
    const departureCity = queryParams.get('departureCity');
    const arrivalCity = queryParams.get('arrivalCity');
    const departureDate = queryParams.get('departureDate');
    const returnDate = queryParams.get('returnDate');
    const flightClass = queryParams.get('flightClass');

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const query = new URLSearchParams({
                    tripType,
                    departureCity,
                    arrivalCity,
                    departureDate,
                    flightClass,
                });

                if (tripType === 'round-trip') {
                    query.append('returnDate', returnDate);
                }

                const res = await fetch(`${BASE_URL}/flights/search/filter?${query.toString()}`);
                const data = await res.json();

                if (data.success) {
                    setFlights(data.data);
                } else {
                    alert('No flights found!');
                }
            } catch (error) {
                console.error('Error fetching flights:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
    }, [tripType, departureCity, arrivalCity, departureDate, returnDate, flightClass]);

    const initialValues = {
        tripType,
        departureCity,
        arrivalCity,
        departureDate,
        returnDate,
        flightClass,
    };

    return (
        <>
            <CommonSection title={"Flight Search Result"} />
            <Container className="pt-4">
                <FlightSearchBar initialValues={initialValues} />

                {loading ? (
                    <Typography sx={{ mt: 3 }}>Loading...</Typography>
                ) : flights.length > 0 ? (
                    <Grid container spacing={3} mt={2}>
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
                ) : (
                    <Typography
                        variant="h5" // Làm chữ to hơn (hoặc dùng 'h4', 'h3' nếu muốn to hơn nữa)
                        align="center" // Căn giữa
                        sx={{ mt: 3, fontWeight: 'bold', color: 'red' }} // Tùy chọn thêm để đẹp hơn
                    >No flights found.</Typography>
                )}
            </Container>
        </>
    );
};

export default SearchResultListFlight;

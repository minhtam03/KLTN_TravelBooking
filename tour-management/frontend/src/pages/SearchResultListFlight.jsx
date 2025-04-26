// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { BASE_URL } from '../utils/config';
// import FlightCard from '../shared/FlightCard';
// import CommonSection from '../shared/CommonSection';
// import FlightSearchBar from '../components/FlightSearchBar/FlightSearchBar';
// import { Container, Typography, Grid, Box } from '@mui/material';

// const SearchResultListFlight = () => {
//     const location = useLocation();
//     const [flights, setFlights] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const queryParams = new URLSearchParams(location.search);
//     const tripType = queryParams.get('tripType');
//     const departureCity = queryParams.get('departureCity');
//     const arrivalCity = queryParams.get('arrivalCity');
//     const departureDate = queryParams.get('departureDate');
//     const returnDate = queryParams.get('returnDate');
//     const flightClass = queryParams.get('flightClass');

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
//     }, [tripType, departureCity, arrivalCity, departureDate, returnDate, flightClass]);

//     const initialValues = {
//         tripType,
//         departureCity,
//         arrivalCity,
//         departureDate,
//         returnDate,
//         flightClass,
//     };

//     return (
//         <>
//             <CommonSection title={"Flight Search Result"} />
//             <Container className="pt-4">
//                 <FlightSearchBar initialValues={initialValues} />

//                 {loading ? (
//                     <Typography sx={{ mt: 3 }}>Loading...</Typography>
//                 ) : flights.length > 0 ? (
//                     <Grid container spacing={3} mt={2}>
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
//                     <Typography
//                         variant="h5" // Làm chữ to hơn (hoặc dùng 'h4', 'h3' nếu muốn to hơn nữa)
//                         align="center" // Căn giữa
//                         sx={{ mt: 3, fontWeight: 'bold', color: 'red' }} // Tùy chọn thêm để đẹp hơn
//                     >No flights found.</Typography>
//                 )}
//             </Container>
//         </>
//     );
// };

// export default SearchResultListFlight;

// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { BASE_URL } from '../utils/config';
// import FlightCard from '../shared/FlightCard';
// import CommonSection from '../shared/CommonSection';
// import FlightSearchBar from '../components/FlightSearchBar/FlightSearchBar';
// import { Container, Typography, Grid, Box } from '@mui/material';

// const SearchResultListFlight = () => {
//     const location = useLocation();
//     const [outboundFlights, setOutboundFlights] = useState([]);
//     const [returnFlights, setReturnFlights] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const queryParams = new URLSearchParams(location.search);
//     const fromPlace = queryParams.get('fromPlace');
//     const toPlace = queryParams.get('toPlace');
//     const departDate = queryParams.get('departDate');
//     const landingDate = queryParams.get('landingDate');
//     const ticketType = queryParams.get('ticketType');

//     const isRoundTrip = landingDate !== null;

//     useEffect(() => {
//         const fetchFlights = async () => {
//             try {
//                 const query = new URLSearchParams({
//                     fromPlace,
//                     toPlace,
//                     departDate,
//                     ticketType,
//                 });

//                 if (isRoundTrip) {
//                     query.append('landingDate', landingDate);
//                 }

//                 const res = await fetch(`${BASE_URL}/flights/search/filter?${query.toString()}`);
//                 const data = await res.json();

//                 if (data.success) {
//                     const { outboundFlights, returnFlights } = data.data;
//                     setOutboundFlights(outboundFlights || []);
//                     setReturnFlights(returnFlights || []);
//                 } else {
//                     setOutboundFlights([]);
//                     setReturnFlights([]);
//                 }
//             } catch (error) {
//                 console.error('Error fetching flights:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchFlights();
//     }, [fromPlace, toPlace, departDate, landingDate, ticketType]);

//     const initialValues = {
//         fromPlace,
//         toPlace,
//         departDate,
//         landingDate,
//         ticketType,
//     };

//     return (
//         <>
//             <CommonSection title={"Kết quả tìm kiếm chuyến bay"} />
//             <Container className="pt-4">
//                 <FlightSearchBar initialValues={initialValues} />

//                 {loading ? (
//                     <Typography sx={{ mt: 3 }}>Đang tải...</Typography>
//                 ) : (
//                     <>
//                         {outboundFlights.length === 0 && returnFlights.length === 0 ? (
//                             <Typography
//                                 variant="h5"
//                                 align="center"
//                                 sx={{ mt: 3, fontWeight: 'bold', color: 'red' }}
//                             >
//                                 Không tìm thấy chuyến bay nào phù hợp.
//                             </Typography>
//                         ) : (
//                             <Grid container spacing={4} mt={2}>
//                                 {/* Chuyến đi */}
//                                 <Grid item xs={12} md={6}>
//                                     <Typography variant="h6" mb={2}>✈️ Chuyến đi</Typography>
//                                     {outboundFlights.length > 0 ? (
//                                         outboundFlights.map((flight) => (
//                                             <Box key={flight._id} mb={2}>
//                                                 <FlightCard flight={flight} />
//                                             </Box>
//                                         ))
//                                     ) : (
//                                         <Typography>Không có chuyến đi phù hợp.</Typography>
//                                     )}
//                                 </Grid>

//                                 {/* Chuyến về */}
//                                 <Grid item xs={12} md={6}>
//                                     <Typography variant="h6" mb={2}>🔁 Chuyến về</Typography>
//                                     {returnFlights.length > 0 ? (
//                                         returnFlights.map((flight) => (
//                                             <Box key={flight._id} mb={2}>
//                                                 <FlightCard flight={flight} />
//                                             </Box>
//                                         ))
//                                     ) : (
//                                         <Typography>Không có chuyến về phù hợp.</Typography>
//                                     )}
//                                 </Grid>
//                             </Grid>
//                         )}
//                     </>
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
    const [outboundFlights, setOutboundFlights] = useState([]);
    const [returnFlights, setReturnFlights] = useState([]);
    const [loading, setLoading] = useState(true);

    const queryParams = new URLSearchParams(location.search);
    const fromPlace = queryParams.get('fromPlace');
    const toPlace = queryParams.get('toPlace');
    const departDate = queryParams.get('departDate');
    const landingDate = queryParams.get('landingDate');
    const ticketType = queryParams.get('ticketType');

    const isRoundTrip = Boolean(landingDate);

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const query = new URLSearchParams({
                    fromPlace,
                    toPlace,
                    departDate,
                    ticketType,
                });

                if (isRoundTrip) {
                    query.append('landingDate', landingDate);
                }

                const res = await fetch(`${BASE_URL}/flights/search/filter?${query.toString()}`);
                const data = await res.json();

                if (data.success) {
                    setOutboundFlights(data.data.outboundFlights || []);
                    setReturnFlights(data.data.returnFlights || []);
                } else {
                    setOutboundFlights([]);
                    setReturnFlights([]);
                }
            } catch (error) {
                console.error('Error fetching flights:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
    }, [fromPlace, toPlace, departDate, landingDate, ticketType]);

    const initialValues = {
        fromPlace,
        toPlace,
        departDate,
        landingDate,
        ticketType,
    };

    return (
        <>
            <CommonSection title="Flight Search Results" />
            <Container className="pt-4">
                <FlightSearchBar initialValues={initialValues} />

                {loading ? (
                    <Typography sx={{ mt: 3 }}>Loading...</Typography>
                ) : (
                    <>
                        {outboundFlights.length === 0 && (!isRoundTrip || returnFlights.length === 0) ? (
                            <Typography
                                variant="h5"
                                align="center"
                                sx={{ mt: 3, fontWeight: 'bold', color: 'red' }}
                            >
                                Not found flight.
                            </Typography>
                        ) : (
                            <Grid container spacing={4} mt={2}>
                                {/* Chuyến đi */}
                                <Grid
                                    item
                                    xs={12}
                                    md={isRoundTrip ? 6 : 12}
                                    sx={!isRoundTrip ? { display: 'flex', justifyContent: 'center' } : {}}
                                >
                                    <Box sx={!isRoundTrip ? { width: '70%' } : { width: '100%' }}>
                                        <Typography variant="h6" mb={2}>✈️ Outbound Flights</Typography>
                                        {outboundFlights.map((flight) => (
                                            <Box key={flight._id} mb={2}>
                                                <FlightCard flight={flight} />
                                            </Box>
                                        ))}
                                    </Box>
                                </Grid>
                                {/* Chuyến về */}
                                {isRoundTrip && (
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6" mb={2}>🔁 Return Flights</Typography>
                                        {returnFlights.length > 0 ? (
                                            returnFlights.map((flight) => (
                                                <Box key={flight._id} mb={2}>
                                                    <FlightCard flight={flight} />
                                                </Box>
                                            ))
                                        ) : (
                                            <Typography>Not found flight.</Typography>
                                        )}
                                    </Grid>
                                )}
                            </Grid>
                        )}
                    </>
                )}
            </Container>
        </>
    );
};

export default SearchResultListFlight;


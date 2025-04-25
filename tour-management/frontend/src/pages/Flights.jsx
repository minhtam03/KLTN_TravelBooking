// code cũ ok

// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';
// import { Container, Typography, Grid, Box } from '@mui/material';
// import FlightSearchBar from '../components/FlightSearchBar/FlightSearchBar';
// import FlightCard from '../shared/FlightCard';
// import { BASE_URL } from '../utils/config';
// import CommonSection from '../shared/CommonSection';

// const Flights = () => {
//   const location = useLocation();
//   const [flights, setFlights] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [page, setPage] = useState(0);
//   const [pageCount, setPageCount] = useState(0);


//   const fetchFlights = async () => {
//     setLoading(true);
//     try {
//       const query = location.search;
//       const endpoint = query ? `${BASE_URL}/flights/search/filter${query}` : `${BASE_URL}/flights`;
//       const res = await axios.get(endpoint);
//       setFlights(res.data.data);
//     } catch (err) {
//       console.error('Failed to fetch flights:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFlights();
//   }, [location.search]);

//   useEffect(() => {
//     const totalPages = Math.ceil(flights.length / 8);
//     setPageCount(totalPages);
//     setPage(0); // reset về page 0 nếu flight list thay đổi
//   }, [flights]);

//   const currentPageFlights = flights.slice(page * 8, (page + 1) * 8);

//   return (
//     <>
//       <CommonSection title={"All Flights"} />
//       <section>
//         <FlightSearchBar />
//       </section>
//       <Container>

//         {loading ? (
//           <Typography>Loading...</Typography>
//         ) : flights.length === 0 ? (
//           <Typography>No flights found.</Typography>
//         ) : (
//           <>
//             <Grid container spacing={2}>
//               {currentPageFlights.map((flight) => (
//                 <Grid item xs={12} key={flight._id}>
//                   <Box display="flex" justifyContent="center">
//                     <Box width="70%">
//                       <FlightCard flight={flight} />
//                     </Box>
//                   </Box>
//                 </Grid>
//               ))}
//             </Grid>

//             {/* Pagination */}
//             <Grid item xs={12}>
//               <div className="pagination d-flex align-items-center justify-content-center mt-4 gap-3">
//                 {[...Array(pageCount).keys()].map(number => (
//                   <span
//                     key={number}
//                     onClick={() => setPage(number)}
//                     className={page === number ? "active__page" : ""}
//                   >
//                     {number + 1}
//                   </span>
//                 ))}
//               </div>
//             </Grid>
//           </>
//         )}
//       </Container>
//     </>
//   );
// };

// export default Flights;


// code cho data mới

// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';
// import { Container, Typography, Grid, Box } from '@mui/material';
// import FlightSearchBar from '../components/FlightSearchBar/FlightSearchBar';
// import FlightCard from '../shared/FlightCard';
// import { BASE_URL } from '../utils/config';
// import CommonSection from '../shared/CommonSection';

// const Flights = () => {
//   const location = useLocation();
//   const [flights, setFlights] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [page, setPage] = useState(0);
//   const [pageCount, setPageCount] = useState(0);


//   const fetchFlightsFromIvivu = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.post('https://apiportal.ivivu.com/web_prot/flightinbound//gate/apiv1/GetFlightDepart', {
//         "roundTrip": false,
//         "fromPlace": "SGN",
//         "toPlace": "DAD",
//         "departDate":
//           "2025-04-27T07:00:00",
//         "returnDate": "2025-04-27T07:00:00",
//         "adult": 1, "child": 0, "infant": 0,
//         "sources": "VietnamAirlines;VietJetAir;BambooAirways",
//         "ticketClass": null,
//         "timeIndayRecomment": "09:00",
//         "version": "2.0",
//         "flightType": "Direct"
//       });


//       // Gộp tất cả chuyến bay từ các nhóm trong mảng `data`
//       const allFlights = res.data.data.flatMap(group => group.flights).slice(0, 30);
//       setFlights(allFlights);

//     } catch (err) {
//       console.error('❌ Failed to fetch ivivu flights:', err);
//       setFlights([]);
//     } finally {
//       setLoading(false);
//     }
//   };


//   useEffect(() => {
//     fetchFlightsFromIvivu();
//   }, []);

//   useEffect(() => {
//     const totalPages = Math.ceil(flights.length / 8);
//     setPageCount(totalPages);
//     setPage(0); // reset về page 0 nếu flight list thay đổi
//   }, [flights]);

//   const currentPageFlights = flights.slice(page * 8, (page + 1) * 8);

//   return (
//     <>
//       <CommonSection title={"All Flights"} />
//       <section>
//         <FlightSearchBar />
//       </section>
//       <Container>

//         {loading ? (
//           <Typography>Loading...</Typography>
//         ) : flights.length === 0 ? (
//           <Typography>No flights found.</Typography>
//         ) : (
//           <>
//             <Grid container spacing={2}>
//               {currentPageFlights.map((flight) => (
//                 <Grid item xs={12} key={flight._id}>
//                   <Box display="flex" justifyContent="center">
//                     <Box width="70%">
//                       <FlightCard flight={flight} />
//                     </Box>
//                   </Box>
//                 </Grid>
//               ))}
//             </Grid>

//             {/* Pagination */}
//             <Grid item xs={12}>
//               <div className="pagination d-flex align-items-center justify-content-center mt-4 gap-3">
//                 {[...Array(pageCount).keys()].map(number => (
//                   <span
//                     key={number}
//                     onClick={() => setPage(number)}
//                     className={page === number ? "active__page" : ""}
//                   >
//                     {number + 1}
//                   </span>
//                 ))}
//               </div>
//             </Grid>
//           </>
//         )}
//       </Container>
//     </>
//   );
// };

// export default Flights;

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Grid, Box } from '@mui/material';
import FlightSearchBar from '../components/FlightSearchBar/FlightSearchBar';
import FlightCard from '../shared/FlightCard';
import { BASE_URL } from '../utils/config';
import CommonSection from '../shared/CommonSection';

const Flights = () => {
  const location = useLocation();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const searchParams = new URLSearchParams(location.search);
  const initialValues = {
    tripType: searchParams.get('returnDate') ? 'round-trip' : 'one-way',
    departureCity: searchParams.get('fromPlace') || '',
    arrivalCity: searchParams.get('toPlace') || '',
    departureDate: searchParams.get('departDate') || '',
    returnDate: searchParams.get('returnDate') || '',
    flightClass: searchParams.get('flightClass') || '',
  };

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const query = location.search;
      const endpoint = query ? `${BASE_URL}/flights/search/filter${query}` : `${BASE_URL}/flights`;
      const res = await axios.get(endpoint);

      setFlights(res.data.data);
    } catch (err) {
      console.error('Failed to fetch flights:', err);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, [location.search]);

  useEffect(() => {
    const totalPages = Math.ceil(flights.length / 8);
    setPageCount(totalPages);
    setPage(0);
  }, [flights]);

  const currentPageFlights = Array.isArray(flights) ? flights.slice(page * 8, (page + 1) * 8) : [];

  return (
    <>
      <CommonSection title={"All Flights"} />
      <section>
        <FlightSearchBar initialValues={initialValues} />
      </section>
      <Container>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : flights.length === 0 ? (
          <Typography>No flights found.</Typography>
        ) : (
          <>
            <Grid container spacing={2}>
              {currentPageFlights.map((flight) => (
                <Grid item xs={12} key={flight._id}>
                  <Box display="flex" justifyContent="center">
                    <Box width="70%">
                      <FlightCard flight={flight} />
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Grid item xs={12}>
              <div className="pagination d-flex align-items-center justify-content-center mt-4 gap-3">
                {[...Array(pageCount).keys()].map(number => (
                  <span
                    key={number}
                    onClick={() => setPage(number)}
                    className={page === number ? "active__page" : ""}
                    style={{ cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    {number + 1}
                  </span>
                ))}
              </div>
            </Grid>
          </>
        )}
      </Container>
    </>
  );
};

export default Flights;

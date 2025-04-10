// import React from 'react'
// import { Container } from 'reactstrap'
// import CommonSection from '../shared/CommonSection'

// const Flights = () => {
//   return (
//     <>
//       <CommonSection  title={"Flights"}/>
//     </>

//   )
// }

// export default Flights

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


  const fetchFlights = async () => {
    setLoading(true);
    try {
      const query = location.search;
      const endpoint = query ? `${BASE_URL}/flights/search/filter${query}` : `${BASE_URL}/flights`;
      const res = await axios.get(endpoint);
      setFlights(res.data.data);
    } catch (err) {
      console.error('Failed to fetch flights:', err);
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
    setPage(0); // reset về page 0 nếu flight list thay đổi
  }, [flights]);

  const currentPageFlights = flights.slice(page * 8, (page + 1) * 8);

  return (
    <>
      <CommonSection title={"All Flights"} />
      <Container>

        <section>
          <FlightSearchBar />
        </section>

        {/* <Box display="flex" justifyContent="center" mt={4}>
          <FlightSearchBar />
        </Box> */}

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

            {/* Pagination */}
            <Grid item xs={12}>
              <div className="pagination d-flex align-items-center justify-content-center mt-4 gap-3">
                {[...Array(pageCount).keys()].map(number => (
                  <span
                    key={number}
                    onClick={() => setPage(number)}
                    className={page === number ? "active__page" : ""}
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

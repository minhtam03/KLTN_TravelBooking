// import React, { useState, useFetch, useEffect } from 'react'
// import CommonSection from './../shared/CommonSection'
// import '../styles/search-result-list-hotel.css'
// import { Container, Row, Col } from 'reactstrap'
// import { format } from 'date-fns';
// import { DateRange } from "react-date-range";
// import { useLocation } from 'react-router-dom'
// import SearchHotelItem from '../components/SearchHotelItem/SearchHotelItem';
// import { BASE_URL } from '../utils/config';
// import axios from 'axios';

// const SearchResultListHotel = () => {
//   const location = useLocation();
//   const [data] = useState(location.state);
//   console.log("Search result:", data);

//   const [hotels, setHotels] = useState([]);
//   const [page, setPage] = useState(0);
//   const [pageCount, setPageCount] = useState(0);

//   useEffect(() => {
//     const fetchHotels = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/hotels?page=${page}`);
//         const countRes = await axios.get(`${BASE_URL}/hotels/count`);

//         setHotels(res.data.data);
//         setPageCount(Math.ceil(countRes.data.count / 8));
//       } catch (err) {
//         console.error('Failed to fetch hotels:', err);
//       }
//     };

//     fetchHotels();
//   }, [page]);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [page]);

//   console.log(location)
//   const [destination, setDestination] = useState(location.state.destination);
//   const [dates, setDates] = useState(location.state.dates);
//   // const [openDate, setOpenDate] = useState(false);
//   // const [options, setOptions] = useState(location.state.options);
//   const [min, setMin] = useState(undefined);
//   const [max, setMax] = useState(undefined);

//   //   const { data, loading, error, reFetch } = useFetch(
//   //     `/hotels?city=${destination}&min=${min || 0 }&max=${max || 999}`
//   //   );

//   const handleClick = () => {
//     // reFetch();
//   };

//   return <>
//     <CommonSection title={"Hotel Search Result"} />
//     <div className="listContainer">
//       <div className="listWrapper">
//         <div className="listSearch">
//           <h1 className="lsTitle">Search</h1>
//           <div className="lsItem">
//             <label>Destination</label>
//             <input placeholder={destination} type="text" />
//           </div>
//           <button onClick={handleClick}>Search</button>
//         </div>
//         <div className="listResult">
//           {data.length === 0 ? (
//             <h4 className='text-center'>No hotel found</h4>
//           ) : (
//             data.map(hotel => (
//               <Col lg='3' className='mb-4' key={hotel._id}>
//                 <SearchHotelItem hotel={hotel} />
//               </Col>
//             ))
//           )}

//           {/* Pagination */}
//           <div className="pagination d-flex align-items-center justify-content-center mt-4 gap-3">
//             {[...Array(pageCount).keys()].map(number => (
//               <span
//                 key={number}
//                 onClick={() => setPage(number)}
//                 className={page === number ? "active__page" : ""}
//               >
//                 {number + 1}
//               </span>
//             ))}
//           </div>
//         </div>

//       </div>
//     </div>

//   </>
// }

// export default SearchResultListHotel

import React, { useState } from 'react';
import CommonSection from './../shared/CommonSection';
import '../styles/search-result-list-hotel.css';
import { Container, Row, Col } from 'reactstrap';
import { useLocation } from 'react-router-dom';
import SearchHotelItem from '../components/SearchHotelItem/SearchHotelItem';
import axios from 'axios';
import { BASE_URL } from '../utils/config';

const SearchResultListHotel = () => {
  const location = useLocation();
  const { data: initialData = [], destination: initialDestination = '', minPrice = '', maxPrice = '' } = location.state || {};

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
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>

            <div className="lsItem">
              <label>Destination</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div className="lsItem">
              <label>Min price (per night)</label>
              <input
                type="number"
                value={min}
                onChange={(e) => setMin(e.target.value)}
              />
            </div>

            <div className="lsItem">
              <label>Max price (per night)</label>
              <input
                type="number"
                value={max}
                onChange={(e) => setMax(e.target.value)}
              />
            </div>

            <button onClick={handleSearch}>Search</button>
          </div>

          <div className="listResult">
            {data.length === 0 ? (
              <h4 className='text-center'>No hotel found</h4>
            ) : (
              data.map(hotel => (
                <SearchHotelItem hotel={hotel} key={hotel._id} />
              ))
            )}
          </div>



        </div>
      </div>
    </>
  );
};

export default SearchResultListHotel;

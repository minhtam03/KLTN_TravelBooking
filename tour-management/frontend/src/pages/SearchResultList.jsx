// import React, {useState} from 'react'
// import CommonSection from './../shared/CommonSection'

// import { Container, Row, Col } from 'reactstrap'
// import { useLocation } from 'react-router-dom'
// import TourCard from '../shared/TourCard'

// const SearchResultList = () => {
//   const location = useLocation()
//   const [data] = useState(location.state)
//   console.log(data)

//   return <>
//     <CommonSection title={"Tour Search Result"}/>
//     <section>
//       <Container>
//         <Row>
//           {
//             data.length === 0 ? (
//               <h4 className='text-center'>No tour found</h4>
//             ) : (
//               data?.map(tour => (
//                 <Col lg='3' className='mb-4' key={tour._id}>
//                   <TourCard tour = {tour}/>

//                 </Col>
//               ))
//             )
//           }
//         </Row>
//       </Container>
//     </section>
//   </>
// }

// export default SearchResultList

import React, { useState, useEffect } from 'react';
import CommonSection from './../shared/CommonSection';
import { Container, Row, Col } from 'reactstrap';
import { useLocation } from 'react-router-dom';
import TourCard from '../shared/TourCard';
import { BASE_URL } from '../utils/config';
import SearchBar from '../shared/SearchBar';

const SearchResultList = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const city = searchParams.get("city") || "";
  const duration = searchParams.get("duration") || "";
  const maxGroupSize = searchParams.get("maxGroupSize") || "";

  useEffect(() => {
    const fetchSearchResult = async () => {
      setLoading(true);
      try {
        const url = `${BASE_URL}/tours/search/getTourBySearch?city=${city}&duration=${duration}&maxGroupSize=${maxGroupSize}&page=${page}`;
        const res = await fetch(url);
        const result = await res.json();

        if (res.ok) {
          setData(result.data);
          const totalPages = Math.ceil((result.total || result.data.length) / 8); // fallback nếu total không có
          setPageCount(totalPages > 0 ? totalPages : 1); // đảm bảo luôn có ít nhất 1 trang
        } else {
          setData([]);
          setPageCount(1); // fallback an toàn
        }
      } catch (err) {
        console.error("Search fetch error:", err);
        setData([]);
        setPageCount(1);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResult();
  }, [city, duration, maxGroupSize, page]);
  return (
    <>
      <CommonSection title={"Tour Search Result"} />
      <section>
        <Container>
          <Row>
            <SearchBar />
          </Row>
        </Container>
      </section>
      <section>
        <Container>

          <Row>
            {loading ? (
              <h4 className='text-center pt-5'>Loading...</h4>
            ) : data.length === 0 ? (
              <h4 className='text-center'>No tour found</h4>
            ) : (
              data.map(tour => (
                <Col lg='3' className='mb-4' key={tour._id}>
                  <TourCard tour={tour} />
                </Col>
              ))
            )}


            <Col lg='12'>
              <div className="pagination d-flex align-items-center justify-content-center mt-4 gap-3">
                {[...Array(pageCount || 1).keys()].map(number => (
                  <span
                    key={number}
                    onClick={() => setPage(number)}
                    className={page === number ? "active__page" : ""}
                  >
                    {number + 1}
                  </span>
                ))}
              </div>
            </Col>

          </Row>
        </Container>
      </section>
    </>
  );
};

export default SearchResultList;

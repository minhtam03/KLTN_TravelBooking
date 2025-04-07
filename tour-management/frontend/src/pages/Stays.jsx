import React, { useState, useEffect } from 'react'
import CommonSection from '../shared/CommonSection'
import { useNavigate } from "react-router-dom";
import SearchBarStay from '../shared/SearchBarStay';
import { Container, Row, Col } from 'reactstrap'
import FeaturedStay from '../components/Featured-stays/FeaturedStay';
import PropertyList from '../components/PropertyList/PropertyList';
import FeaturedProperties from '../components/Featured-property/FeaturedProperties';
import { BASE_URL } from '../utils/config';
import axios from 'axios';
import SearchHotelItem from '../components/SearchHotelItem/SearchHotelItem';

import '../styles/stays.css'

const Stays = () => {

  const [hotels, setHotels] = useState([]);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/hotels?page=${page}`);
        const countRes = await axios.get(`${BASE_URL}/hotels/count`);

        setHotels(res.data.data);
        setPageCount(Math.ceil(countRes.data.count / 8));
      } catch (err) {
        console.error('Failed to fetch hotels:', err);
      }
    };

    fetchHotels();
  }, [page]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <>
      <CommonSection title={"All Stays"} />

      {/* search bar */}
      <section>
        <SearchBarStay />
      </section>
      {/*  */}
      {/* <section className="homeContainer"> */}


      <div className="listHotel">
        {hotels.length === 0 ? (
          <p className="text-center">No hotels found</p>
        ) : (
          hotels.map(hotel => (
            <SearchHotelItem hotel={hotel} key={hotel._id} />
          ))
        )}

        {/* Pagination */}
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
      </div>
      {/* </section> */}
    </>

  )
}

export default Stays
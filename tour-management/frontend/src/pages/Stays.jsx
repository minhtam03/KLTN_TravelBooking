import React from 'react'
import CommonSection from '../shared/CommonSection'
import { faBed } from "@fortawesome/free-solid-svg-icons/faBed";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons/faCalendarDays";
import { faPerson } from "@fortawesome/free-solid-svg-icons/faPerson";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateRange } from "react-date-range";
import { useContext, useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import SearchBarStay from '../shared/SearchBarStay';
import { Container, Row, Col } from 'reactstrap'
import FeaturedStay from '../components/Featured-stays/FeaturedStay';
import PropertyList from '../components/PropertyList/PropertyList';
import FeaturedProperties from '../components/Featured-property/FeaturedProperties';
import '../styles/stays.css'
const Stays = () => {

  return (
    <>
      <CommonSection  title={"Stays"}/>

      {/* search bar */}
      <section>
        <Container>
          <Row>
            <SearchBarStay/>
          </Row>
        </Container>
      </section>

      {/*  */}
      <section className="homeContainer">
        <FeaturedStay/>
      
        <h1 className="homeTitle">Browse by property type</h1>
        <PropertyList/>

        <h1 className="homeTitle">Homes guests love</h1>
        <FeaturedProperties/>
      </section>
    </>
    
  )
}

export default Stays
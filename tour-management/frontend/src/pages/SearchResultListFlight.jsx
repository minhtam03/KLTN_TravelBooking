// pages/SearchResultListFlight.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BASE_URL } from '../utils/config';
import FlightCard from '../shared/FlightCard'; // component hiển thị thông tin chuyến bay
import { Container, Row, Col } from 'reactstrap';
import CommonSection from '../shared/CommonSection';

const SearchResultListFlight = () => {
    const location = useLocation();
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);

    const queryParams = new URLSearchParams(location.search);
    const departureCity = queryParams.get('departureCity');
    const arrivalCity = queryParams.get('arrivalCity');
    const departureDate = queryParams.get('departureDate');
    const returnDate = queryParams.get('returnDate');
    const flightClass = queryParams.get('class');
    const tripType = queryParams.get('tripType');

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
    }, [departureCity, arrivalCity, departureDate, returnDate, flightClass, tripType]);

    return (
        <>
            <CommonSection title={"Flight Search Result"} />
            <Container className="pt-5">

                <Row>
                    {loading ? (
                        <p>Loading...</p>
                    ) : flights.length > 0 ? (
                        flights.map((flight) => (
                            <Col lg="4" md="6" sm="12" key={flight._id}>
                                <FlightCard flight={flight} />
                            </Col>
                        ))
                    ) : (
                        <p>No flights found.</p>
                    )}
                </Row>
            </Container>
        </>

    );
};

export default SearchResultListFlight;

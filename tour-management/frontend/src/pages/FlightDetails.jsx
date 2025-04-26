import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import useFetch from '../hooks/useFetch';
import { BASE_URL } from '../utils/config';
import BookingForm from '../components/Booking/BookingForm';
import BookingFlightForm from '../components/Booking/BookingFlightForm';

const FlightDetails = () => {
    const { id } = useParams();
    const { data: flight, loading, error } = useFetch(`${BASE_URL}/flights/${id}`);
    const {
        _id,
        airline,
        flightNumber,
        fromPlace,
        fromPlaceCode,
        toPlace,
        toPlaceCode,
        ticketType,
        aircraftStr,
        totalPriceUSD,
        departTime,
        landingTime,
        departDate,
        departTimeStr,
        landingDate,
        landingTimeStr,
        isReturn,
    } = flight || {};


    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <section>
            <Container>
                {loading && <h4 className="text-center pt-5">Loading...</h4>}
                {error && <h4 className="text-center pt-5">{error}</h4>}
                {!loading && !error && (
                    <Row>
                        <BookingFlightForm flight={flight} />
                    </Row>
                )}
            </Container>
        </section>
    );
};

export default FlightDetails;

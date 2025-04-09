import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import useFetch from '../hooks/useFetch';
import { BASE_URL } from '../utils/config';
import BookingForm from '../components/Booking/BookingForm';
// import '../styles/flight-details.css';
import BookingFlightForm from '../components/Booking/BookingFlightForm';

const FlightDetails = () => {
    const { id } = useParams();
    const { data: flight, loading, error } = useFetch(`${BASE_URL}/flights/${id}`);
    const {
        airline,
        flightNumber,
        departureCity,
        arrivalCity,
        departureDate,
        returnDate,
        departureTime,
        returnTime,
        airplaneType,
        class: flightClass,
        tripType,
        price,
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
                        {/* <Col lg="8">
                            <div className="flight__content">
                                <div className="flight__info">
                                    <h2>{airline} - {flightNumber}</h2>
                                    <div className="mb-2">
                                        <i className="ri-flight-takeoff-line"></i> From: <strong>{departureCity}</strong> &nbsp;
                                        <i className="ri-flight-land-line"></i> To: <strong>{arrivalCity}</strong>
                                    </div>

                                    <div className="mb-2">
                                        <i className="ri-calendar-line"></i> Departure: {new Date(departureDate).toLocaleDateString()} at {departureTime}
                                    </div>

                                    {tripType === 'round-trip' && (
                                        <div className="mb-2">
                                            <i className="ri-calendar-check-line"></i> Return: {new Date(returnDate).toLocaleDateString()} at {returnTime}
                                        </div>
                                    )}

                                    <div className="mb-2">
                                        <i className="ri-plane-line"></i> Airplane: {airplaneType}
                                    </div>

                                    <div className="mb-2">
                                        <i className="ri-star-line"></i> Class: {flightClass}
                                    </div>

                                    <div className="flight__price">
                                        <i className="ri-money-dollar-circle-line"></i> ${price}
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col lg="4">
                        
                            <BookingFlightForm flight={flight} />
                        </Col> */}
                        <BookingFlightForm flight={flight} />
                    </Row>
                )}
            </Container>
        </section>
    );
};

export default FlightDetails;

import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/admin/sidebar/Sidebar';
import Navbar from '../../../components/admin/navbar/Navbar';
import "../single/single.scss";
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../../utils/config';
import BookingTable from '../../../components/admin/table/BookingTable';

const SingleFlight = () => {
    const { id } = useParams();
    const [flight, setFlight] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchFlight = async () => {
            try {
                const res = await fetch(`${BASE_URL}/flights/${id}`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Failed to fetch flight data");
                const result = await res.json();
                setFlight(result.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchFlightBookings = async () => {
            try {
                const res = await fetch(`${BASE_URL}/booking/flight/bookings-with-amount`, {
                    method: "GET",
                    credentials: "include",
                });

                const result = await res.json();

                const flightBookings = result.data?.filter(b => b.flightId === id);
                setBookings(flightBookings || []);
            } catch (err) {
                console.error("Error fetching bookings:", err);
            }
        };

        fetchFlight();
        fetchFlightBookings();
    }, [id]);

    return (
        <div className="single">
            <Sidebar />
            <div className="singleContainer">
                <Navbar />
                <div className="top">
                    <div className="left">
                        <h1 className="title">Flight Information</h1>
                        {loading ? (
                            <p>Loading flight data...</p>
                        ) : error ? (
                            <p>Error: {error}</p>
                        ) : (
                            <div className="item">

                                <div className="details">
                                    <h1 className="itemTitle">{flight?.flightNumber || "Unknown"}</h1>

                                    <div className="detailItem"><span className="itemKey">Airline:</span><span className="itemValue">{flight?.airline}</span></div>
                                    <div className="detailItem"><span className="itemKey">Flight Number:</span><span className="itemValue">{flight?.flightNumber}</span></div>
                                    <div className="detailItem"><span className="itemKey">From:</span><span className="itemValue">{flight?.departureCity}</span></div>
                                    <div className="detailItem"><span className="itemKey">To:</span><span className="itemValue">{flight?.arrivalCity}</span></div>
                                    <div className="detailItem"><span className="itemKey">Trip Type:</span><span className="itemValue">{flight?.tripType}</span></div>
                                    <div className="detailItem"><span className="itemKey">Departure Date:</span><span className="itemValue">{flight?.departureDate?.slice(0, 10)}</span></div>
                                    <div className="detailItem"><span className="itemKey">Departure Time:</span><span className="itemValue">{flight?.departureTime}</span></div>

                                    {flight?.tripType === "round-trip" && (
                                        <>
                                            <div className="detailItem"><span className="itemKey">Return Date:</span><span className="itemValue">{flight?.returnDate?.slice(0, 10) || "-"}</span></div>
                                            <div className="detailItem"><span className="itemKey">Return Time:</span><span className="itemValue">{flight?.returnTime || "-"}</span></div>
                                        </>
                                    )}

                                    <div className="detailItem"><span className="itemKey">Class:</span><span className="itemValue">{flight?.class}</span></div>
                                    <div className="detailItem"><span className="itemKey">Aircraft:</span><span className="itemValue">{flight?.airplaneType}</span></div>
                                    <div className="detailItem"><span className="itemKey">Price:</span><span className="itemValue">{flight?.price} $</span></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Booking Table */}

                <BookingTable flightId={id} />
            </div>
        </div>
    );
};

export default SingleFlight;

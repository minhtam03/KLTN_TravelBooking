import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/admin/sidebar/Sidebar';
import Navbar from '../../../components/admin/navbar/Navbar';
import Chart from '../../../components/admin/chart/Chart';
import BookingTable from '../../../components/admin/table/BookingTable';
import "../single/single.scss";
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../../utils/config';

const SingleHotel = () => {
    const { id } = useParams();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [spendingData, setSpendingData] = useState([]);

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const res = await fetch(`${BASE_URL}/hotels/${id}`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Failed to fetch hotel data");
                const result = await res.json();
                setHotel(result.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchSpendingData = async () => {
            try {
                const res = await fetch(`${BASE_URL}/booking/hotel/bookings-with-amount`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Failed to fetch hotel bookings");
                const result = await res.json();

                const hotelBookings = result.data.filter(booking => booking.hotelId === id);

                const monthlySpending = {};

                hotelBookings.forEach(booking => {
                    const date = new Date(booking.createdAt);
                    const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

                    if (!monthlySpending[monthYear]) {
                        monthlySpending[monthYear] = 0;
                    }

                    monthlySpending[monthYear] += booking.amount || 0;
                });

                const last6Months = [];
                const currentDate = new Date();
                for (let i = 5; i >= 0; i--) {
                    const month = currentDate.getMonth() + 1 - i;
                    const year = currentDate.getFullYear();
                    const key = `${month}-${year}`;

                    last6Months.push({
                        name: new Date(year, month - 1).toLocaleString('en-US', { month: 'long' }),
                        Total: monthlySpending[key] || 0,
                    });
                }

                setSpendingData(last6Months);
            } catch (err) {
                console.error(err);
            }
        };

        fetchHotel();
        fetchSpendingData();
    }, [id]);

    return (
        <div className="single">
            <Sidebar />
            <div className="singleContainer">
                <Navbar />
                <div className="top">
                    <div className="left">
                        <h1 className="title">Hotel Information</h1>
                        {loading ? (
                            <p>Loading hotel data...</p>
                        ) : error ? (
                            <p>Error: {error}</p>
                        ) : (
                            <div className="item">
                                <img
                                    src={hotel?.photo || "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}
                                    alt="Hotel"
                                    className="itemImg"
                                />
                                <div className="details">
                                    <h1 className="itemTitle">{hotel?.hotelName || "Unknown"}</h1>

                                    <div className="detailItem">
                                        <span className="itemKey">Hotel Name:</span>
                                        <span className="itemValue">{hotel?.hotelName || "N/A"}</span>
                                    </div>

                                    <div className="detailItem">
                                        <span className="itemKey">City:</span>
                                        <span className="itemValue">{hotel?.location || "N/A"}</span>
                                    </div>

                                    <div className="detailItem">
                                        <span className="itemKey">Star:</span>
                                        <span className="itemValue">{hotel?.stars || "N/A"}</span>
                                    </div>

                                    <div className="detailItem">
                                        <span className="itemKey">Amenities:</span>
                                        <span className="itemValue">{hotel?.amenities || "N/A"}</span>
                                    </div>

                                    <div className="detailItem">
                                        <span className="itemKey">Price per Night:</span>
                                        <span className="itemValue">{hotel?.pricePerNight || "N/A"} $</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="right">
                        <Chart aspect={3 / 1} title="Hotel Revenue (Last 6 Months)" data={spendingData} />
                    </div>
                </div>

                <div className="bottom">
                    <h1 className="title">Hotel Transactions</h1>
                    <BookingTable hotelId={id} />
                </div>
            </div>
        </div>
    );
};

export default SingleHotel;

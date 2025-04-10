import React, { useState, useEffect } from 'react';
import './homeAdmin.scss';

import Sidebar from '../../../components/admin/sidebar/Sidebar';
import Navbar from '../../../components/admin/navbar/Navbar';
import Widget from '../../../components/admin/widget/Widget';
import Chart from '../../../components/admin/chart/Chart';
import BookingTable from '../../../components/admin/table/BookingTable';
import Featured from '../../../components/admin/featured/Featured';

import { BASE_URL } from '../../../utils/config';

const HomeAdmin = () => {
    const [revenueData, setRevenueData] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const [resTour, resHotel, resFlight] = await Promise.all([
                    fetch(`${BASE_URL}/booking/tour/bookings-with-amount`, {
                        method: 'GET',
                        credentials: 'include',
                    }),
                    fetch(`${BASE_URL}/booking/hotel/bookings-with-amount`, {
                        method: 'GET',
                        credentials: 'include',
                    }),
                    fetch(`${BASE_URL}/booking/flight/bookings-with-amount`, {
                        method: 'GET',
                        credentials: 'include',
                    }),
                ]);

                const [tourData, hotelData, flightData] = await Promise.all([
                    resTour.json(),
                    resHotel.json(),
                    resFlight.json(),
                ]);

                const allBookings = [
                    ...(tourData?.data || []),
                    ...(hotelData?.data || []),
                    ...(flightData?.data || []),
                ];

                const monthlyRevenue = {};
                allBookings.forEach((booking) => {
                    const date = new Date(booking.bookAt);
                    const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
                    monthlyRevenue[monthYear] = (monthlyRevenue[monthYear] || 0) + (booking.amount || 0);
                });

                const last6Months = [];
                const currentDate = new Date();

                for (let i = 5; i >= 0; i--) {
                    const month = (currentDate.getMonth() - i + 12) % 12 + 1;
                    const year = currentDate.getMonth() - i < 0
                        ? currentDate.getFullYear() - 1
                        : currentDate.getFullYear();
                    const key = `${month}-${year}`;

                    last6Months.push({
                        name: new Date(year, month - 1).toLocaleString('en-US', { month: 'long' }),
                        Total: monthlyRevenue[key] || 0,
                    });
                }

                setRevenueData(last6Months);
            } catch (error) {
                console.error('Error fetching revenue data:', error);
            }
        };

        fetchBookings();
    }, []);


    return (
        <div className="home">
            <Sidebar />
            <div className="homeContainer">
                <Navbar />
                <div className="widgets">
                    <Widget type="user" />
                    <Widget type="tour" />
                    <Widget type="hotel" />
                    <Widget type="flight" />
                    {/* <Widget type="earning" /> */}
                </div>
                <div className="charts">
                    <Featured />
                    <Chart title="Last 6 Months (Total Revenue)" aspect={2 / 1} data={revenueData} />
                </div>

                <div className="listContainer">
                    <div className="listTitle">All Transactions</div>
                    {/* Hiển thị cả tour và hotel booking khi không truyền gì cả */}
                    <BookingTable />
                </div>
            </div>
        </div>
    );
};

export default HomeAdmin;

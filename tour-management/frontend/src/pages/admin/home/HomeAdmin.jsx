import React, { useState, useEffect } from 'react';
import './homeAdmin.scss'

import Sidebar from '../../../components/admin/sidebar/Sidebar'
import Navbar from '../../../components/admin/navbar/Navbar'
import Widget from '../../../components/admin/widget/Widget'
import Chart from '../../../components/admin/chart/Chart'
import Table from '../../../components/admin/table/Table'
import Featured from '../../../components/admin/featured/Featured'

import { BASE_URL } from '../../../utils/config';

const HomeAdmin = () => {
    const [revenueData, setRevenueData] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch(`${BASE_URL}/booking/bookings-with-amount`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch bookings');
                }

                const result = await res.json();

                // Tạo object để lưu tổng doanh thu theo từng tháng
                const monthlyRevenue = {};

                // Duyệt qua từng booking và tổng hợp doanh thu theo tháng
                result.data.forEach(booking => {
                    const date = new Date(booking.bookAt);
                    const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`; // Ví dụ: "3-2024"

                    if (!monthlyRevenue[monthYear]) {
                        monthlyRevenue[monthYear] = 0;
                    }

                    monthlyRevenue[monthYear] += booking.amount || 0;
                });

                // Chuyển object thành mảng để hiển thị trong biểu đồ
                const last6Months = [];
                const currentDate = new Date();

                for (let i = 5; i >= 0; i--) {
                    const month = currentDate.getMonth() + 1 - i;
                    const year = currentDate.getFullYear();
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
        <>
            <div className="home">
                <Sidebar />
                <div className="homeContainer">
                    <Navbar />
                    <div className="widgets">
                        <Widget type="user" />
                        <Widget type="tour" />
                        <Widget type="booking" />
                        <Widget type="earning" />
                    </div>
                    <div className="charts">
                        <Featured />
                        <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} data={revenueData} />
                    </div>
                    <div className="listContainer">
                        <div className="listTitle">All Transactions</div>
                        <Table />
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomeAdmin
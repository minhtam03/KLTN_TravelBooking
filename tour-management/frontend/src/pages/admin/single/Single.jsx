import React, { useState, useEffect } from 'react'
import Sidebar from '../../../components/admin/sidebar/Sidebar'
import Navbar from '../../../components/admin/navbar/Navbar'
import Chart from '../../../components/admin/chart/Chart'
import BookingTable from '../../../components/admin/table/BookingTable'
import "./single.scss"
import { useParams } from 'react-router-dom'
import { BASE_URL } from '../../../utils/config'

const Single = () => {

    const { id } = useParams()
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [spendingData, setSpendingData] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${BASE_URL}/users/${id}`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch user data");
                }

                const result = await res.json();
                setUser(result.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        // const fetchSpendingData = async () => {
        //     try {
        //         const res = await fetch(`${BASE_URL}/booking/tour/bookings-with-amount`, {
        //             method: 'GET',
        //             credentials: 'include',
        //         });

        //         if (!res.ok) {
        //             throw new Error('Failed to fetch bookings');
        //         }

        //         const result = await res.json();
        //         const userBookings = result.data.filter(booking => booking.userId === id
        //             // && booking.paymentStatus === "paid"
        //         );

        //         const monthlySpending = {};

        //         // Duyệt qua từng booking và tổng hợp chi tiêu theo tháng
        //         userBookings.forEach(booking => {
        //             const date = new Date(booking.createdAt);
        //             const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`; // Ví dụ: "3-2024"

        //             if (!monthlySpending[monthYear]) {
        //                 monthlySpending[monthYear] = 0;
        //             }

        //             monthlySpending[monthYear] += booking.amount || 0;
        //         });

        //         // Chuyển object thành mảng để hiển thị trong biểu đồ
        //         const last6Months = [];
        //         const currentDate = new Date();

        //         for (let i = 5; i >= 0; i--) {
        //             const month = currentDate.getMonth() + 1 - i;
        //             const year = currentDate.getFullYear();
        //             const key = `${month}-${year}`;

        //             last6Months.push({
        //                 name: new Date(year, month - 1).toLocaleString('en-US', { month: 'long' }),
        //                 Total: monthlySpending[key] || 0,
        //             });
        //         }

        //         setSpendingData(last6Months);
        //     } catch (error) {
        //         console.error('Error fetching spending data:', error);
        //     }
        // };

        const fetchSpendingData = async () => {
            try {
                const endpoints = [
                    `${BASE_URL}/booking/tour/bookings-with-amount`,
                    `${BASE_URL}/booking/hotel/bookings-with-amount`
                ];

                const responses = await Promise.all(endpoints.map(url =>
                    fetch(url, { method: "GET", credentials: "include" })
                ));

                const allResults = await Promise.all(responses.map(res => res.json()));

                let allBookings = [];
                for (const result of allResults) {
                    if (result.success) {
                        const userBookings = result.data.filter(b => b.userId === id);
                        allBookings = allBookings.concat(userBookings);
                    }
                }

                const monthlySpending = {};

                allBookings.forEach(booking => {
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
                    const month = (currentDate.getMonth() - i + 12) % 12 + 1;
                    const year = currentDate.getMonth() - i < 0
                        ? currentDate.getFullYear() - 1
                        : currentDate.getFullYear();
                    const key = `${month}-${year}`;

                    last6Months.push({
                        name: new Date(year, month - 1).toLocaleString('en-US', { month: 'long' }),
                        Total: monthlySpending[key] || 0,
                    });
                }

                setSpendingData(last6Months);
            } catch (error) {
                console.error('Error fetching spending data:', error);
            }
        };
        fetchUser();
        fetchSpendingData();
    }, [id]);

    return (
        <div className="single">
            <Sidebar />
            <div className="singleContainer">
                <Navbar />
                <div className="top">
                    <div className="left">
                        {/* <div className="editButton">Edit</div> */}
                        <h1 className="title">Information</h1>

                        {loading ? (
                            <p>Loading user data...</p>
                        ) : error ? (
                            <p>Error: {error}</p>
                        ) : (
                            <div className="item">
                                <img
                                    src={user?.photo || "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}
                                    alt="User Profile"
                                    className="itemImg"
                                />
                                {/* <img
                                    src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                                    alt=""
                                    className="itemImg"
                                /> */}
                                <div className="details">
                                    <h1 className="itemTitle">{user?.username || "Unknown"}</h1>

                                    <div className="detailItem">
                                        <span className="itemKey">Username:</span>
                                        <span className="itemValue">{user?.username || "N/A"}</span>
                                    </div>
                                    <div className="detailItem">
                                        <span className="itemKey">Email:</span>
                                        <span className="itemValue">{user?.email || "N/A"}</span>
                                    </div>
                                    <div className="detailItem">
                                        <span className="itemKey">Phone:</span>
                                        <span className="itemValue">{user?.phone || "N/A"}</span>
                                    </div>
                                    <div className="detailItem">
                                        <span className="itemKey">Address:</span>
                                        <span className="itemValue">{user?.address || "N/A"}</span>
                                    </div>
                                    <div className="detailItem">
                                        <span className="itemKey">Photo:</span>
                                        <span className="itemValue">{user?.photo || "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="right">
                        <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" data={spendingData} />
                    </div>
                </div>
                <div className="bottom">
                    <h1 className="title">User Transactions</h1>
                    <BookingTable userId={id} />
                </div>
            </div>
        </div>
    );
};

export default Single;

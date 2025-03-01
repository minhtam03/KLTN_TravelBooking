import React, { useState, useEffect } from 'react'
import Sidebar from '../../../components/admin/sidebar/Sidebar'
import Navbar from '../../../components/admin/navbar/Navbar'
import Chart from '../../../components/admin/chart/Chart'
import BookingTable from '../../../components/admin/table/Table'
import "./single.scss"
import { useParams } from 'react-router-dom'
import { BASE_URL } from '../../../utils/config'

const Single = () => {

    const { id } = useParams()
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

        fetchUser();
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
                                {/* <img
                                    src={user?.profilePic || "https://via.placeholder.com/150"}
                                    alt="User Profile"
                                    className="itemImg"
                                /> */}
                                <img
                                    src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                                    alt=""
                                    className="itemImg"
                                />
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
                                        <span className="itemKey">Address:</span>
                                        <span className="itemValue">{user?.address || "N/A"}</span>
                                    </div>
                                    <div className="detailItem">
                                        <span className="itemKey">Country:</span>
                                        <span className="itemValue">{user?.country || "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="right">
                        <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" />
                    </div>
                </div>
                <div className="bottom">
                    <h1 className="title">Transactions</h1>
                    <BookingTable userId={id} />
                </div>
            </div>
        </div>
    );
};

export default Single;

import "./widget.scss";
import { useState, useEffect } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { BASE_URL } from "../../../utils/config";
import { useNavigate, Link } from "react-router-dom";
import { faL } from "@fortawesome/free-solid-svg-icons";

const Widget = ({ type }) => {
    const navigate = useNavigate()
    const [data, setData] = useState(null);
    const [growth, setGrowth] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${BASE_URL}/stats/widget-data`);
                if (!res.ok) throw new Error("Failed to fetch widget data");
                const result = await res.json();
                setData(result.data);
            } catch (error) {
                console.error("Error fetching widget data:", error);
            }
        };
        fetchData();
    }, []);

    // useEffect(() => {
    //     const fetchGrowth = async () => {
    //         try {
    //             const res = await fetch(`${BASE_URL}/stats/growth`);
    //             if (!res.ok) throw new Error("Failed to fetch growth");
    //             const result = await res.json();
    //             setGrowth(result.data[type]);
    //         } catch (error) {
    //             console.error("Error fetching user growth:", error);
    //         }
    //     };
    //     fetchGrowth();
    // }, [type]);

    let widgetData;

    if (!data) {
        return <div>Loading...</div>;
    }

    switch (type) {
        case "user":
            widgetData = {
                title: "USERS",
                isMoney: false,
                amount: data.user,
                link: "See all users",
                url: "/admin/users",
                icon: (
                    <PersonOutlinedIcon
                        className="icon"
                        style={{
                            color: "crimson",
                            backgroundColor: "rgba(255, 0, 0, 0.2)",
                        }}
                    />
                ),
            };
            break;
        // case "booking":
        //     widgetData = {
        //         title: "BOOKINGS",
        //         isMoney: false,
        //         amount: data.booking,
        //         link: "View all bookings",
        //         url: "/admin/bookings",
        //         icon: (
        //             <ShoppingCartOutlinedIcon
        //                 className="icon"
        //                 style={{
        //                     backgroundColor: "rgba(218, 165, 32, 0.2)",
        //                     color: "goldenrod",
        //                 }}
        //             />
        //         ),
        //     };
        //     break;

        case "tour":
            widgetData = {
                title: "TOURS",
                isMoney: false,
                amount: data.tour,
                link: "See all tours",
                url: "/admin/tours",
                icon: (
                    <AccountBalanceWalletOutlinedIcon
                        className="icon"
                        style={{
                            backgroundColor: "rgba(128, 0, 128, 0.2)",
                            color: "purple",
                        }}
                    />
                ),
            };
            break;

        case "hotel":
            widgetData = {
                title: "HOTELS",
                isMoney: false,
                amount: data.tour,
                link: "See all hotels",
                url: "/admin/hotels",
                icon: (
                    <AccountBalanceWalletOutlinedIcon
                        className="icon"
                        style={{
                            backgroundColor: "rgba(128, 0, 128, 0.2)",
                            color: "purple",
                        }}
                    />
                ),
            };
            break;
        case "earning":
            widgetData = {
                title: "Revenue",
                isMoney: true,
                amount: data.earning,
                link: "View Revenue",
                icon: (
                    <MonetizationOnOutlinedIcon
                        className="icon"
                        style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
                    />
                ),
            };
            break;
        default:
            break;
    }
    // const growthClass = growth !== null && growth < 0 ? "negative" : "positive";
    // const displayGrowth = growth !== null ? Math.abs(growth) : "Loading...";
    // const GrowthIcon = growth < 0 ? KeyboardArrowDownIcon : KeyboardArrowUpIcon;

    return (
        <div className="widget">
            <div className="left">
                <span className="title">{widgetData.title}</span>
                <span className="counter">
                    {widgetData.isMoney && "$"} {widgetData.amount}
                </span>
                <span>
                    <Link to={widgetData.url} className="link">
                        {widgetData.link}
                    </Link>
                </span>
            </div>
            {/* <div className="right">
                <div className={`percentage ${growthClass}`}>
                    <GrowthIcon />
                    {displayGrowth}%
                </div>
                {widgetData.icon}
            </div> */}

            <div className="right">

                {widgetData.icon}
            </div>
        </div>
    );
};

export default Widget;


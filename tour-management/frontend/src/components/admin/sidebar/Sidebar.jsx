import React, { useContext } from "react";
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
} from "@mui/material";
import {
    Dashboard as DashboardIcon,
    PersonOutline as PersonOutlineIcon,
    LocalShipping as LocalShippingIcon,
    CreditCard as CreditCardIcon,
    Store as StoreIcon,
    Article as ArticleIcon,
    ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import TourIcon from '@mui/icons-material/Tour';
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

const Sidebar = () => {
    const navigate = useNavigate();
    const { dispatch } = useContext(AuthContext);

    const logout = () => {
        dispatch({ type: "LOGOUT" });
        navigate("/", { replace: true });
    };

    const navItems = [
        {
            title: "MAIN",
            items: [
                { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/home" },
            ],
        },
        {
            title: "LISTS",
            items: [
                { text: "Users", icon: <PersonOutlineIcon />, path: "/admin/users" },
                { text: "Tours", icon: <TourIcon />, path: "/admin/tours" },
                { text: "Hotels", icon: <StoreIcon />, path: "/admin/hotels" },
                { text: "Flight", icon: <FlightTakeoffIcon />, path: "/admin/flights" },
            ],
        },
        {
            title: "CONTENT",
            items: [
                { text: "Blogs", icon: <ArticleIcon />, path: "/admin/posts" },
            ],
        },
        {
            title: "ACCOUNT",
            items: [
                {
                    text: "Logout",
                    icon: <ExitToAppIcon />,
                    action: logout,
                },
            ],
        },
    ];

    return (
        <Box
            sx={{

                position: "fixed",           // 👈 giữ cố định
                top: 0,
                left: 0,
                width: 240,
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: 3,
                p: 2,
                bgcolor: "#fff",             // nên có để che nền khi cố định
                zIndex: 1200,                // để đảm bảo nổi trên nội dung

            }}
        >
            <Box>
                <Box sx={{
                    mb: 2, mt: 2,
                    borderBottom: "1px solid #ccc", // 👈 Thêm dòng này để có border dưới màu xám nhạt
                    pb: 1,

                }}>
                    <Link to="/admin/home" style={{ textDecoration: "none" }}>
                        <Typography
                            variant="h6"
                            color="primary"
                            sx={{ fontWeight: "bold", pl: 1, textAlign: "center", color: "var(--secondary-color)" }}
                        >
                            Admin
                        </Typography>
                    </Link>
                </Box>

                {navItems.map((section, index) => (
                    <Box key={index}>
                        <Typography
                            fontSize={12}
                            color="textSecondary"
                            sx={{ pl: 1, mt: 2 }}
                        >
                            {section.title}
                        </Typography>
                        <List>
                            {section.items.map((item, i) =>
                                item.action ? (
                                    <ListItem
                                        button
                                        key={i}
                                        onClick={item.action}

                                        sx={{
                                            cursor: "pointer",
                                            borderRadius: 2,
                                            "&:hover": { backgroundColor: "rgb(223, 222, 222)" },
                                        }}
                                    >
                                        <ListItemIcon>{item.icon}</ListItemIcon>
                                        <Typography fontSize={16} fontWeight={500}>
                                            {item.text}
                                        </Typography>
                                    </ListItem>
                                ) : (
                                    <Link
                                        to={item.path}
                                        key={i}
                                        style={{ textDecoration: "none", color: "inherit" }}
                                    >
                                        <ListItem
                                            button

                                            sx={{
                                                borderRadius: 2,
                                                "&:hover": { backgroundColor: "rgb(223, 222, 222)" },
                                            }}
                                        >
                                            <ListItemIcon>{item.icon}</ListItemIcon>
                                            <Typography fontSize={16} fontWeight={500}>
                                                {item.text}
                                            </Typography>
                                        </ListItem>
                                    </Link>
                                )
                            )}
                        </List>
                        {index < navItems.length - 1 && <Divider />}
                    </Box>
                ))}
            </Box>

            <Box sx={{ height: 20 }} />
        </Box>
    );
};

export default Sidebar;

import "./navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const Navbar = () => {
    // const { dispatch } = useContext();
    const { user } = useContext(AuthContext);

    return (
        <div className="navbar">
            <div className="wrapper">
                <div>

                </div>
                <div className="items">

                    <div className="item username">
                        {user ? user.username : "Guest"}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;

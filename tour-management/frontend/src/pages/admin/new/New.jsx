import "./new.scss";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import Navbar from "../../../components/admin/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { BASE_URL } from "../../../utils/config";
import { useNavigate, useLocation } from "react-router-dom";

const New = ({ inputs, title }) => {
    const [info, setInfo] = useState({});
    const navigate = useNavigate();

    const location = useLocation();
    const path = location.pathname.split("/")[2];

    const [credentials, setCredentials] = useState({
        username: undefined,
        email: undefined,
        password: undefined
    })

    const handleChange = (e) => {
        if (path === "users") {
            setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }))
        }
        else {
            setInfo(prev => ({ ...prev, [e.target.name]: e.target.value }))
        }
    };


    const handleClick = async (e) => {
        e.preventDefault();

        try {
            // Gửi request tạo user
            if (path === "users") {
                const res = await fetch(`${BASE_URL}/${path}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include',
                    body: JSON.stringify(credentials),

                });
                const result = await res.json();
                if (!res.ok) {
                    return alert(result.message);
                }
            } else {
                const res = await fetch(`${BASE_URL}/${path}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include',
                    body: JSON.stringify(info),

                });
                const result = await res.json();


                if (!res.ok) {
                    return alert(result.message);
                }
            }


            alert("Created successfully!");
            navigate(`/admin/${path}`);
        } catch (err) {
            console.error("Error:", err);
            alert("Failed to create user. Please try again.");
        }
    };


    console.log(info);
    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>{title}</h1>
                </div>
                <div className="bottom">
                    <div className="left">
                        <img
                            src={

                                "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                            }
                            alt=""
                        />
                    </div>
                    <div className="right">
                        <form>
                            <div className="formInput">
                                <label htmlFor="file">
                                    Image: <DriveFolderUploadOutlinedIcon className="icon" />
                                </label>
                                <input
                                    type="file"
                                    id="file"

                                    style={{ display: "none" }}
                                />
                            </div>
                            {inputs.map((input) => (
                                <div className="formInput" key={input.id}>
                                    <label>{input.label}</label>
                                    <input
                                        onChange={handleChange}
                                        type={input.type}
                                        placeholder={input.placeholder}
                                        // id={input.id}
                                        name={input.id}
                                    />
                                </div>
                            ))}

                            <button onClick={handleClick}>Create</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default New;

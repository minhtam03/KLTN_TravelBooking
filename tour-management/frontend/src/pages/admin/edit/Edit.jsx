import "../new/new.scss"
import Sidebar from "../../../components/admin/sidebar/Sidebar"
import Navbar from "../../../components/admin/navbar/Navbar"
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect } from "react";
import { BASE_URL } from "../../../utils/config";
import { useNavigate, useParams, useLocation } from "react-router-dom";


const Edit = ({ inputs, title }) => {
    const { id } = useParams(); // Lấy ID từ URL
    const location = useLocation();
    const path = location.pathname.split("/")[2]; // Lấy path từ URL (users hoặc tours)
    const navigate = useNavigate();

    const [info, setInfo] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${BASE_URL}/${path}/${id}`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch data");
                }

                const result = await res.json();
                setInfo(result.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [id, path]);

    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${BASE_URL}/${path}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(info),
            });

            const result = await res.json();
            if (!res.ok) {
                return alert(result.message);
            }

            alert("Updated successfully!");
            navigate(`/admin/${path}`);
        } catch (err) {
            console.error("Error updating data:", err);
            alert("Failed to update. Please try again.");
        }
    };

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
                                info.profilePic || info.image ||
                                "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                            }
                            alt=""
                        />
                    </div>
                    <div className="right">
                        {loading ? (
                            <p>Loading data...</p>
                        ) : (
                            <form>
                                <div className="formInput">
                                    <label htmlFor="file">
                                        Image: <DriveFolderUploadOutlinedIcon className="icon" />
                                    </label>
                                    <input type="file" id="file" style={{ display: "none" }} />
                                </div>
                                {inputs.map((input) => (
                                    <div className="formInput" key={input.id}>
                                        <label>{input.label}</label>
                                        <input
                                            onChange={handleChange}
                                            type={input.type}
                                            placeholder={input.placeholder}
                                            name={input.id}
                                            value={info[input.id] || ""}
                                        />
                                    </div>
                                ))}

                                <button onClick={handleUpdate}>Update</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Edit;





























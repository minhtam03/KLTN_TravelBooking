import "./edit.scss"
import Sidebar from "../../../components/admin/sidebar/Sidebar"
import Navbar from "../../../components/admin/navbar/Navbar"
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect } from "react";
import { BASE_URL } from "../../../utils/config";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { CircularProgress } from '@mui/material';
import axios from "axios"

const Edit = ({ inputs, title }) => {
    const { id } = useParams();
    const location = useLocation();
    const path = location.pathname.split("/")[2];
    const navigate = useNavigate();

    const [info, setInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    const [resetPassword, setResetPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

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
        setIsUpdating(true);

        try {
            let photoUrl = info.photo;
            if (file) {
                const data = new FormData();
                data.append("file", file);
                data.append("upload_preset", "upload");

                const uploadRes = await axios.post(
                    "https://api.cloudinary.com/v1_1/djvjlojfn/image/upload",
                    data
                );

                photoUrl = uploadRes.data.url; // Lấy URL từ Cloudinary
            }

            const updateData = { ...info, photo: photoUrl };

            if (path === "users") {
                // Nếu admin không chọn reset password, đảm bảo không gửi password lên server
                if (!resetPassword) {
                    delete updateData.password;
                } else {
                    // Nếu có password mới, đảm bảo password được gửi đi
                    if (!newPassword) {
                        setIsUpdating(false);
                        return alert("Please enter a new password.");
                    }
                    updateData.password = newPassword;
                }
            }

            const res = await fetch(`${BASE_URL}/${path}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(updateData),
            });

            const result = await res.json();
            if (!res.ok) {
                setIsUpdating(false);
                return alert(result.message);
            }

            alert("Updated successfully!");
            navigate(`/admin/${path}`);
        } catch (err) {
            console.error("Error updating data:", err);
            alert("Failed to update. Please try again.");
        }
        finally {
            setIsUpdating(false); // Tắt trạng thái loading
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
                            src={file ? URL.createObjectURL(file) : info.photo || "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}
                            alt="Photo"
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
                                    <input
                                        type="file"
                                        id="file"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        style={{ display: "none" }}
                                    />
                                </div>

                                {inputs
                                    .filter((input) => !(path === "users" && input.id === "password"))
                                    .map((input) => (
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
                                    ))
                                }

                                {/* Checkbox Reset Password */}
                                {path === "users" && (
                                    <div className="formInput resetPasswordContainer">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={resetPassword}
                                                onChange={() => setResetPassword(!resetPassword)}
                                            />
                                            Reset Password
                                        </label>
                                    </div>
                                )}

                                {resetPassword && (
                                    <div className="formInput">
                                        <label>New Password</label>
                                        <div className="passwordInputWrapper">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter new password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                            <span
                                                className="togglePassword"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </span>

                                        </div>
                                    </div>
                                )}

                                <button onClick={handleUpdate} disabled={isUpdating}>
                                    {isUpdating ? <CircularProgress size={24} color="inherit" /> : "Update"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Edit;





























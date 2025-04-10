// import "./new.scss";
// import Sidebar from "../../../components/admin/sidebar/Sidebar";
// import Navbar from "../../../components/admin/navbar/Navbar";
// import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
// import { useState } from "react";
// import { BASE_URL } from "../../../utils/config";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import axios from "axios";

// const New = ({ inputs, title }) => {
//     const [info, setInfo] = useState({});
//     const navigate = useNavigate();

//     const location = useLocation();
//     const path = location.pathname.split("/")[2];

//     const [showPassword, setShowPassword] = useState(false);
//     const [file, setFile] = useState("");

//     const [credentials, setCredentials] = useState({
//         username: undefined,
//         email: undefined,
//         password: undefined,
//     });

//     const handleChange = (e) => {
//         if (path === "users") {
//             setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//         } else {
//             setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//         }
//     };

//     const handleClick = async (e) => {
//         e.preventDefault();

//         let photoUrl = "";

//         if (file) {
//             const data = new FormData();
//             data.append("file", file);
//             data.append("upload_preset", "upload");

//             const uploadRes = await axios.post(
//                 "https://api.cloudinary.com/v1_1/djvjlojfn/image/upload",
//                 data
//             );

//             photoUrl = uploadRes.data.url;
//         }

//         const updatedInfo = { ...info, photo: photoUrl };
//         const updatedCredentials = { ...credentials, photo: photoUrl };

//         try {
//             const res = await fetch(`${BASE_URL}/${path}`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 credentials: "include",
//                 body: JSON.stringify(path === "users" ? updatedCredentials : updatedInfo),
//             });

//             const result = await res.json();

//             if (!res.ok) {
//                 return alert(result.message);
//             }

//             alert("Created successfully!");
//             navigate(`/admin/${path}`);
//         } catch (err) {
//             console.error("Error:", err);
//             alert("Failed to create. Please try again.");
//         }
//     };

//     return (
//         <div className="new">
//             <Sidebar />
//             <div className="newContainer">
//                 <Navbar />
//                 <div className="top">
//                     <h1>{title}</h1>
//                 </div>
//                 <div className="bottom">
//                     <div className="left">
//                         <img
//                             src={
//                                 file
//                                     ? URL.createObjectURL(file)
//                                     : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
//                             }
//                             alt="Preview"
//                         />
//                     </div>
//                     <div className="right">
//                         <form>
//                             <div className="formInput">
//                                 <label htmlFor="file">
//                                     Image: <DriveFolderUploadOutlinedIcon className="icon" />
//                                 </label>
//                                 <input
//                                     type="file"
//                                     id="file"
//                                     onChange={(e) => setFile(e.target.files[0])}
//                                     style={{ display: "none" }}
//                                 />
//                             </div>

//                             {inputs.map((input) => (
//                                 <div className="formInput" key={input.id}>
//                                     <label>{input.label}</label>

//                                     {input.id === "password" ? (
//                                         <div className="passwordInputWrapper">
//                                             <input
//                                                 onChange={handleChange}
//                                                 type={showPassword ? "text" : "password"}
//                                                 placeholder={input.placeholder}
//                                                 name={input.id}
//                                             />
//                                             <span
//                                                 className="togglePassword"
//                                                 onClick={() => setShowPassword(!showPassword)}
//                                             >
//                                                 {showPassword ? <VisibilityOff /> : <Visibility />}
//                                             </span>
//                                         </div>
//                                     ) : input.type === "select" ? (
//                                         <select name={input.id} onChange={handleChange} defaultValue="">
//                                             <option value="" disabled>Select a city</option>
//                                             {input.options?.map((opt) => (
//                                                 <option key={opt} value={opt}>{opt}</option>
//                                             ))}
//                                         </select>
//                                     ) : (
//                                         <input
//                                             onChange={handleChange}
//                                             type={input.type}
//                                             placeholder={input.placeholder}
//                                             name={input.id}
//                                         />
//                                     )}
//                                 </div>
//                             ))}

//                             <button onClick={handleClick}>Create</button>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default New;

// Các import như cũ...
import "./new.scss";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import Navbar from "../../../components/admin/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { BASE_URL } from "../../../utils/config";
import { useNavigate, useLocation } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";

const New = ({ inputs, title }) => {
    const [info, setInfo] = useState({});
    const [tripType, setTripType] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname.split("/")[2];

    const [showPassword, setShowPassword] = useState(false);
    const [file, setFile] = useState("");

    const [credentials, setCredentials] = useState({
        username: undefined,
        email: undefined,
        password: undefined,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "tripType") {
            setTripType(value); // cập nhật state để kiểm tra ẩn/hiện returnDate/Time
        }

        if (path === "users") {
            setCredentials((prev) => ({ ...prev, [name]: value }));
        } else {
            setInfo((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleClick = async (e) => {
        e.preventDefault();

        let photoUrl = "";

        if (file && path !== "flights") {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "upload");

            const uploadRes = await axios.post(
                "https://api.cloudinary.com/v1_1/djvjlojfn/image/upload",
                data
            );

            photoUrl = uploadRes.data.url;
        }

        const updatedInfo =
            path === "flights"
                ? { ...info }
                : { ...info, photo: photoUrl };

        const updatedCredentials = { ...credentials, photo: photoUrl };

        try {
            const res = await fetch(`${BASE_URL}/${path}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(path === "users" ? updatedCredentials : updatedInfo),
            });

            const result = await res.json();

            if (!res.ok) {
                return alert(result.message);
            }

            alert("Created successfully!");
            navigate(`/admin/${path}`);
        } catch (err) {
            console.error("Error:", err);
            alert("Failed to create. Please try again.");
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
                    {path !== "flights" && (
                        <div className="left">
                            <img
                                src={
                                    file
                                        ? URL.createObjectURL(file)
                                        : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                                }
                                alt="Preview"
                            />
                        </div>
                    )}
                    <div className="right">
                        <form>
                            {path !== "flights" && (
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
                            )}

                            {inputs.map((input) => {
                                // Ẩn returnDate và returnTime nếu tripType !== "round-trip"
                                if (
                                    (input.id === "returnDate" || input.id === "returnTime") &&
                                    tripType !== "round-trip"
                                ) {
                                    return null;
                                }

                                return (
                                    <div className="formInput" key={input.id}>
                                        <label>{input.label}</label>

                                        {input.id === "password" ? (
                                            <div className="passwordInputWrapper">
                                                <input
                                                    onChange={handleChange}
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder={input.placeholder}
                                                    name={input.id}
                                                />
                                                <span
                                                    className="togglePassword"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </span>
                                            </div>
                                        ) : input.type === "select" ? (
                                            <select
                                                name={input.id}
                                                onChange={handleChange}
                                                defaultValue=""
                                            >
                                                <option value="" disabled>
                                                    Select
                                                </option>
                                                {input.options?.map((opt) => (
                                                    <option key={opt} value={opt}>
                                                        {opt}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                onChange={handleChange}
                                                type={input.type}
                                                placeholder={input.placeholder}
                                                name={input.id}
                                            />
                                        )}
                                    </div>
                                );
                            })}

                            <button onClick={handleClick}>Create</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default New;

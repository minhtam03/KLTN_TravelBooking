import "./new.scss";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import Navbar from "../../../components/admin/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";

const New = ({ inputs, title }) => {
    const [file, setFile] = useState("");
    const [info, setInfo] = useState({});

    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    //   const handleClick = async (e) => {
    //     e.preventDefault();
    //     const data = new FormData();
    //     data.append("file", file);
    //     data.append("upload_preset", "upload");
    //     try {
    //       const uploadRes = await axios.post(
    //         "https://api.cloudinary.com/v1_1/lamadev/image/upload",
    //         data
    //       );

    //       const { url } = uploadRes.data;

    //       const newUser = {
    //         ...info,
    //         img: url,
    //       };

    //       await axios.post("/auth/register", newUser);
    //     } catch (err) {
    //       console.log(err);
    //     }
    //   };

    console.log(info);
    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>Add user</h1>
                </div>
                <div className="bottom">
                    <div className="left">
                        <img
                            src={
                                file
                                    ? URL.createObjectURL(file)
                                    : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
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
                                    // onChange={(e) => setFile(e.target.files[0])}
                                    style={{ display: "none" }}
                                />
                            </div>

                            {/* {inputs.map((input) => (
                                <div className="formInput" key={input.id}>
                                    <label>{input.label}</label>
                                    <input
                                        // onChange={handleChange}
                                        type={input.type}
                                        placeholder={input.placeholder}
                                        id={input.id}
                                    />
                                </div>
                            ))} */}
                            {/* <button onClick={handleClick}>Send</button> */}
                            <div className="formInput">
                                <label>Username</label>
                                <input type="text" placeholder="john_doe" />
                            </div>

                            <div className="formInput">
                                <label>Name and surname</label>
                                <input type="text" placeholder="John Doe" />
                            </div>

                            <div className="formInput">
                                <label>Email</label>
                                <input type="email" placeholder="abc@gmail.com" />
                            </div>

                            <div className="formInput">
                                <label>Phone</label>
                                <input type="text" placeholder="0123456789" />
                            </div>

                            <div className="formInput">
                                <label>Password</label>
                                <input type="password" placeholder="" />
                            </div>

                            <div className="formInput">
                                <label>Address</label>
                                <input type="text" placeholder="Ha Noi, Viet Nam" />
                            </div>


                            <button>Send</button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default New;

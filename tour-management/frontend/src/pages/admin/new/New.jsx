import "./new.scss";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import Navbar from "../../../components/admin/navbar/Navbar";
import { useState } from "react";
import { BASE_URL } from "../../../utils/config";
import { useNavigate } from "react-router-dom";

const New = ({ inputs, title }) => {
    const [info, setInfo] = useState({});
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        username: undefined,
        email: undefined,
        password: undefined
    })

    const handleChange = (e) => {
        setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }))
    };


    const handleClick = async (e) => {
        e.preventDefault();

        try {
            // Gửi request tạo user
            const res = await fetch(`${BASE_URL}/users`, {
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

            alert("User created successfully!");
            navigate("/admin/users");
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
                    <div className="right">
                        <form>
                            {inputs.map((input) => (
                                <div className="formInput" key={input.id}>
                                    <label>{input.label}</label>
                                    <input
                                        onChange={handleChange}
                                        type={input.type}
                                        placeholder={input.placeholder}
                                        id={input.id}
                                    />
                                </div>
                            ))}

                            <button onClick={handleClick}>Send</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default New;

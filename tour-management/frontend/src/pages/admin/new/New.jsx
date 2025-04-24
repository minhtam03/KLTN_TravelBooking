import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Grid,
    Typography,
    Button,
    TextField,
    IconButton,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    InputAdornment,
    Avatar,
    Container, Checkbox, FormControlLabel
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import Navbar from "../../../components/admin/navbar/Navbar";
import { BASE_URL } from "../../../utils/config";
import axios from "axios";

const New = ({ inputs, title }) => {
    const [info, setInfo] = useState({});
    const [tripType, setTripType] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [file, setFile] = useState("");
    const [credentials, setCredentials] = useState({ username: "", email: "", password: "" });

    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname.split("/")[2];

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     if (name === "tripType") setTripType(value);
    //     if (path === "users") {
    //         setCredentials((prev) => ({ ...prev, [name]: value }));
    //     } else {
    //         setInfo((prev) => ({ ...prev, [name]: value }));
    //     }
    // };
    const handleChange = (e) => {
        const { name, value } = e.target;

        const parsedValue =
            name === "price"
                ? parseFloat(value)
                : name === "guestSize"
                    ? parseInt(value)
                    : value;

        if (name === "tripType") setTripType(value);

        if (path === "users") {
            setCredentials((prev) => ({ ...prev, [name]: parsedValue }));
        } else {
            setInfo((prev) => ({ ...prev, [name]: parsedValue }));
        }
    };

    const handleClick = async (e) => {
        e.preventDefault();
        let photoUrl = "";
        if (file && path !== "flights") {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "upload");
            const uploadRes = await axios.post("https://api.cloudinary.com/v1_1/djvjlojfn/image/upload", data);
            photoUrl = uploadRes.data.url;
        }
        const bodyData = path === "users"
            ? { ...credentials, photo: photoUrl }
            : { ...info, photo: photoUrl };

        try {
            const res = await fetch(`${BASE_URL}/${path}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(bodyData),
            });
            const result = await res.json();
            if (!res.ok) return alert(result.message);
            alert("Created successfully!");
            navigate(`/admin/${path}`);
        } catch (err) {
            console.error("Error:", err);
            alert("Failed to create. Please try again.");
        }
    };

    return (
        <Box display="flex">
            <Sidebar />
            <Box flex={6} p={2} sx={{ ml: "240px", flexGrow: 1 }}>
                <Navbar />
                {/* <Typography variant="h4" mb={2}>{title}</Typography> */}
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                        fontSize: 30,
                        fontFamily: 'Volkhov, Georgia, serif',
                        fontWeight: 700,
                        color: '#1C2B38'
                    }}
                >
                    {title}
                </Typography>
                <Container maxWidth="lg">
                    <Grid container spacing={6} justifyContent="center" mt={2}>
                        {path !== "flights" && (
                            <Grid item xs={12} md={3}>
                                <Box display="flex" flexDirection="column" gap={4}>
                                    <Avatar
                                        variant="circular"
                                        src={file ? URL.createObjectURL(file) : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}
                                        alt="Preview"
                                        sx={{ width: "100%", height: 240, objectFit: "cover" }}
                                    />
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        component="label"
                                        startIcon={<DriveFolderUploadOutlinedIcon />}
                                    >
                                        Upload Image
                                        <input hidden type="file" onChange={(e) => setFile(e.target.files[0])} />
                                    </Button>
                                </Box>
                            </Grid>
                        )}
                        <Grid item xs={12} md={9}>
                            <Box component="form" display="flex" flexDirection="column" gap={2}>
                                <Grid container spacing={6}>
                                    {inputs.map((input) => {

                                        if (input.id === "featured" && path === "tours") {
                                            return (
                                                <Grid item xs={12} sm={6} key={input.id}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                name="feature"
                                                                checked={info.feature === true || info.feature === "true"}
                                                                onChange={(e) => setInfo(prev => ({ ...prev, feature: e.target.checked }))}
                                                            />
                                                        }
                                                        label={input.label}
                                                    />
                                                </Grid>
                                            );
                                        }

                                        if ((input.id === "returnDate" || input.id === "returnTime") && tripType !== "round-trip") return null;

                                        const commonProps = {
                                            name: input.id,
                                            placeholder: input.placeholder,
                                            onChange: handleChange,
                                            fullWidth: true
                                        };

                                        return (
                                            <Grid item xs={12} sm={6} key={input.id}>
                                                <Box display="flex" alignItems="center" gap={3}>
                                                    <Typography sx={{ width: 140, fontWeight: 500 }}>{input.label}:</Typography>
                                                    {input.id === "password" ? (
                                                        <TextField
                                                            {...commonProps}
                                                            type={showPassword ? "text" : "password"}
                                                            InputProps={{
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                                        </IconButton>
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                            variant="standard"
                                                        />
                                                    ) : input.type === "select" ? (
                                                        <FormControl variant="standard" fullWidth>
                                                            <Select
                                                                name={input.id}
                                                                defaultValue=""
                                                                onChange={handleChange}
                                                            >
                                                                {input.options?.map((opt) => (
                                                                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    ) : (
                                                        <TextField
                                                            {...commonProps}
                                                            type={input.type || "text"}
                                                            variant="standard"
                                                        />
                                                    )}
                                                </Box>
                                            </Grid>
                                        );
                                    })}
                                </Grid>

                                <Box mt={4} display="flex" justifyContent="center">
                                    <Button
                                        variant="contained"
                                        onClick={handleClick}
                                        sx={{
                                            backgroundColor: '#f28b82', // đỏ nhạt
                                            color: '#fff',
                                            '&:hover': {
                                                backgroundColor: '#e57373', // đỏ nhạt hơn khi hover
                                            }
                                        }}
                                    >
                                        Create
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default New;


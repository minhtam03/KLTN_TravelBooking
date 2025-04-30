import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
    Container,
    Checkbox,
    FormControlLabel,
    CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import Navbar from "../../../components/admin/navbar/Navbar";
import { BASE_URL } from "../../../utils/config";
import axios from "axios";
import { placeCodeMap } from "../../../utils/cities";


const formatDateInput = (dateStr) => (!dateStr ? "" : new Date(dateStr).toISOString().split("T")[0]);
const formatTimeInput = (timeStr) => (!timeStr ? "" : timeStr.length === 5 ? timeStr : timeStr.slice(0, 5));


// const placeCodeMap = {
//     'Ha Noi': 'HAN',
//     'Ho Chi Minh': 'SGN',
//     'Da Nang': 'DAD',
//     'Hai Phong': 'HPH',
//     'Can Tho': 'VCA',
//     'Hue': 'HUI',
//     'Vinh': 'VII',
//     'Nha Trang': 'CXR',
//     'Quy Nhon': 'UIH',
//     'Phu Quoc': 'PQC',
// };


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
    const [tripType, setTripType] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${BASE_URL}/${path}/${id}`, {
                    method: "GET",
                    credentials: "include",
                });

                const result = await res.json();
                setInfo(result.data);
                setTripType(result.data.tripType || "");
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [id, path]);

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     if (name === "tripType") setTripType(value);
    //     setInfo((prev) => ({ ...prev, [name]: value }));
    // };
    const handleChange = (e) => {
        const { name, value } = e.target;

        setInfo((prev) => {
            let updated = { ...prev, [name]: value };

            if (path === "flights") {
                if (name === "fromPlace") {
                    updated.fromPlaceCode = placeCodeMap[value] || "";
                }
                if (name === "toPlace") {
                    updated.toPlaceCode = placeCodeMap[value] || "";
                }
            }

            if (name === "tripType") setTripType(value);

            return updated;
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);

        try {
            let photoUrl = info.photo;
            if (file && path !== "flights") {
                const data = new FormData();
                data.append("file", file);
                data.append("upload_preset", "upload");
                const uploadRes = await axios.post("https://api.cloudinary.com/v1_1/djvjlojfn/image/upload", data);
                photoUrl = uploadRes.data.url;
            }

            const updateData = { ...info };
            if (path !== "flights") updateData.photo = photoUrl;
            if (path === "users") {
                if (!resetPassword) delete updateData.password;
                else {
                    if (!newPassword) {
                        setIsUpdating(false);
                        return alert("Please enter a new password.");
                    }
                    updateData.password = newPassword;
                }
            }

            const res = await fetch(`${BASE_URL}/${path}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
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
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Box display="flex">
            <Sidebar />
            <Box flex={6} p={2} sx={{ ml: "240px", flexGrow: 1 }}>
                <Navbar />
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontSize: 30, fontFamily: 'Volkhov, Georgia, serif', fontWeight: 700, color: '#1C2B38' }}
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
                                        src={file ? URL.createObjectURL(file) : info.photo || "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}
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
                            {loading ? (
                                <Typography>Loading data...</Typography>
                            ) : (
                                <Box component="form" display="flex" flexDirection="column" gap={2}>
                                    <Grid container spacing={6}>
                                        {inputs.filter(input => !(path === "users" && input.id === "password"))
                                            .map((input) => {
                                                if (input.id === "featured" && path === "tours") {
                                                    return (
                                                        <Grid item xs={12} sm={6} key={input.id}>
                                                            <FormControlLabel
                                                                control={<Checkbox name="feature" checked={info.feature === true || info.feature === "true"} onChange={(e) => setInfo(prev => ({ ...prev, feature: e.target.checked }))} />}
                                                                label={input.label}
                                                            />
                                                        </Grid>
                                                    );
                                                }
                                                if ((input.id === "returnDate" || input.id === "returnTime") && tripType !== "round-trip") return null;

                                                return (
                                                    <Grid item xs={12} sm={6} key={input.id}>
                                                        <Box display="flex" alignItems="center" gap={3}>
                                                            <Typography sx={{ width: 140, fontWeight: 500 }}>{input.label}:</Typography>
                                                            {input.type === "select" ? (
                                                                <FormControl variant="standard" fullWidth>
                                                                    <Select
                                                                        name={input.id}
                                                                        value={info[input.id] || ""}
                                                                        onChange={handleChange}
                                                                    >
                                                                        {input.options.map((opt) => (
                                                                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                            ) : (
                                                                <TextField
                                                                    name={input.id}
                                                                    placeholder={input.placeholder}
                                                                    value={
                                                                        input.type === "date"
                                                                            ? formatDateInput(info[input.id])
                                                                            : input.type === "time"
                                                                                ? formatTimeInput(info[input.id])
                                                                                : info[input.id] || ""
                                                                    }
                                                                    // type={input.type || "text"}
                                                                    // onChange={handleChange}
                                                                    // fullWidth
                                                                    // variant="standard"
                                                                    type={input.type === "textarea" ? undefined : input.type || "text"}
                                                                    onChange={handleChange}
                                                                    fullWidth
                                                                    variant="standard"
                                                                    multiline={input.type === "textarea"}
                                                                    minRows={input.type === "textarea" ? 6 : undefined}
                                                                />
                                                            )}
                                                        </Box>
                                                    </Grid>
                                                );
                                            })}
                                    </Grid>

                                    {path === "users" && (
                                        <Box display="flex" alignItems="center" gap={2} >
                                            <Checkbox checked={resetPassword} onChange={() => setResetPassword(!resetPassword)} />
                                            <Typography >Reset Password</Typography>
                                        </Box>
                                    )}

                                    {resetPassword && (
                                        <Grid item xs={12} sm={6}>
                                            <Box display="flex" alignItems="center" gap={3}>
                                                <Typography sx={{ width: 140, fontWeight: 500 }}>New Password:</Typography>
                                                <TextField
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Enter new password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    variant="standard"
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    fullWidth
                                                />
                                            </Box>
                                        </Grid>
                                    )}

                                    <Box mt={4} display="flex" justifyContent="center">
                                        <Button
                                            variant="contained"
                                            onClick={handleUpdate}
                                            disabled={isUpdating}
                                            sx={{ backgroundColor: '#f28b82', color: '#fff', '&:hover': { backgroundColor: '#e57373' } }}
                                        >
                                            {isUpdating ? <CircularProgress size={24} color="inherit" /> : "Update"}
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default Edit;












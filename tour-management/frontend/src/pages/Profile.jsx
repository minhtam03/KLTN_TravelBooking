import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";
import { Container, TextField, Button, Typography, Box, Grid, Paper, Avatar, IconButton } from "@mui/material";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useNavigate } from "react-router-dom";
import CommonSection from "../shared/CommonSection";

const Profile = () => {
    const { user, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        address: "",
        currentPassword: "",
        newPassword: "",
        photo: "",
    });

    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
                photo: user.photo || "",
                currentPassword: "",
                newPassword: "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        // Tự động upload ảnh khi chọn ảnh
        if (selectedFile) {
            setUploading(true);

            try {
                const data = new FormData();
                data.append("file", selectedFile);
                data.append("upload_preset", "upload");

                const uploadRes = await axios.post(
                    "https://api.cloudinary.com/v1_1/djvjlojfn/image/upload",
                    data
                );

                const photoUrl = uploadRes.data.url;
                console.log(photoUrl)
                setFormData({ ...formData, photo: photoUrl });
            } catch (error) {
                console.error("Error uploading image:", error);
                alert("Failed to upload image. Please try again.");
            } finally {
                setUploading(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedData = {
                username: formData.username,
                phone: formData.phone,
                address: formData.address,
                photo: formData.photo,
            };

            if (formData.newPassword) {
                updatedData.currentPassword = formData.currentPassword;
                updatedData.newPassword = formData.newPassword;
            }

            const res = await axios.put(`${BASE_URL}/users/profile`, updatedData, {
                withCredentials: true,
            });

            dispatch({ type: "LOGIN_SUCCESS", payload: res.data.data });

            alert("Profile updated successfully!");

            navigate("/");
        } catch (err) {
            alert("Error updating profile!");
        }
    };

    return (
        <>
            <CommonSection title={"Edit Personal Information"} />
            <Container maxWidth="lg">
                {/* <Box sx={{ textAlign: "center", my: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Edit Personal Information
                    </Typography>
                </Box> */}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={4}>
                        {/* Left Column: Profile Image */}
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 3, borderRadius: 2, textAlign: "center" }}>
                                <Typography variant="h6" gutterBottom>
                                    Profile Picture
                                </Typography>

                                {/* Display the selected image */}
                                <Avatar
                                    src={file ? URL.createObjectURL(file) : formData.photo || "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}
                                    sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="fileUpload"
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="fileUpload">
                                    <IconButton color="primary" component="span">
                                        <DriveFolderUploadOutlinedIcon />
                                    </IconButton>
                                </label>
                            </Paper>
                        </Grid>

                        {/* Middle Column: User Info & Change Password */}
                        <Grid item xs={12} md={8}>
                            <Paper sx={{ p: 3, borderRadius: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Personal Information
                                </Typography>

                                {/* Username */}
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    variant="outlined"
                                />

                                {/* Email - Chỉ hiển thị, không chỉnh sửa */}
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Email"
                                    name="email"
                                    value={formData.email}
                                    variant="outlined"
                                    disabled
                                />

                                {/* Phone Number */}
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Phone Number"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    variant="outlined"
                                />

                                {/* Address */}
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    variant="outlined"
                                />

                                <Box sx={{ mt: 4 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Change Password
                                    </Typography>

                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Current Password"
                                        name="currentPassword"
                                        type="password"
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        variant="outlined"
                                    />

                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="New Password"
                                        name="newPassword"
                                        type="password"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Submit Button */}
                    <Box sx={{ mt: 4, textAlign: "center" }}>
                        <Button type="submit" variant="contained" color="primary">
                            Save Changes
                        </Button>
                    </Box>
                </form>
            </Container>
        </>

    );
};

export default Profile;

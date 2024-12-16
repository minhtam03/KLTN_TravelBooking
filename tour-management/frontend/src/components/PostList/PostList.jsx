import React, { useState, useEffect } from "react";
import Grid from '@mui/material/Grid'; 
import Post from "./Post/Post";
import { Box, CircularProgress, Typography } from "@mui/material";
import { BASE_URL } from '../../utils/config';

export default function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch posts data when component mounts
    useEffect(() => {
        const fetchPosts = async () => {
        try {
            const response = await fetch(`${BASE_URL}/posts/`); 
            if (!response.ok) {
            throw new Error('Failed to fetch posts');
            }
            const data = await response.json();
            setPosts(data.data); 
        } catch (error) {
            setError(error.message); 
        } finally {
            setLoading(false); 
        }
    };

    fetchPosts();
    }, []);

    if (loading) {
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
          </Box>
        );
    }

    // Hiển thị lỗi nếu có
    if (error) {
        return (
        <Box sx={{ textAlign: 'center', marginTop: 3 }}>
            <Typography variant="h6" color="error">
            {error}
            </Typography>
        </Box>
        );
    }


    // Hiển thị bài viết nếu có
    return (
        <Grid container spacing={4} alignItems="stretch">
        {posts.map((post) => (
            <Grid item xs={12} sm={6} key={post._id}>
            <Post post={post} />
            </Grid>
        ))}
        </Grid>
    );
}

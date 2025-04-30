import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Typography,
    CircularProgress,
    Card,
    CardMedia,
    Chip,
    IconButton,
    Tooltip
} from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";
import moment from "moment";

export default function PostDetail() {
    const { id } = useParams();
    const { user: currentUser } = useContext(AuthContext);
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likeCount, setLikeCount] = useState(0);
    const [likedUsers, setLikedUsers] = useState([]);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`${BASE_URL}/posts/${id}`);
                if (!response.ok) throw new Error("Failed to fetch post");
                const data = await response.json();
                setPost(data.data);
                setLikeCount(data.data.likeCount);
                setLikedUsers(data.data.likedUsers || []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    useEffect(() => {
        setIsLiked(currentUser && likedUsers.includes(currentUser._id));
    }, [currentUser, likedUsers]);

    const onLikeBtnClick = async () => {
        if (!currentUser) {
            alert("Bạn cần đăng nhập để like bài viết!");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/posts/${id}/like`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: currentUser._id })
            });

            if (!response.ok) throw new Error("Failed to like/unlike post");
            const updatedPost = await response.json();
            setLikeCount(updatedPost.data.likeCount);
            setLikedUsers(updatedPost.data.likedUsers);
        } catch (error) {
            console.error("Error liking/unliking post:", error);
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error" sx={{ fontFamily: 'Mulish' }}>{error}</Typography>;
    if (!post) return <Typography sx={{ fontFamily: 'Mulish' }}>Không tìm thấy bài viết</Typography>;

    return (
        <Box
            sx={{
                width: '70%',
                margin: 'auto',
                padding: 3,
                backgroundColor: '#fff',
                fontFamily: 'Mulish'
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 'bold',
                    fontSize: 40,
                    color: '#222',
                    mb: 1
                }}
            >
                {post.title}
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 1
                }}
            >
                <Chip
                    label={moment(post.createdAt).format("DD/MM/YYYY")}
                    sx={{
                        backgroundColor: "#F1F3F4",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        padding: '6px 12px',
                        borderRadius: '16px'
                    }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title={isLiked ? "Unlike" : "Like"}>
                        <IconButton onClick={onLikeBtnClick} color={isLiked ? "error" : "default"}>
                            <FavoriteIcon />
                            <Typography component="span" sx={{ ml: 0.5 }}>
                                {likeCount}
                            </Typography>
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {post.photo && (
                <Card
                    sx={{
                        width: '100%',
                        maxHeight: 450,
                        objectFit: 'cover',
                        borderRadius: 2,
                        mt: 4,
                        mb: 4
                    }}
                >
                    <CardMedia
                        component="img"
                        image={post.photo}
                        alt={post.title}
                        sx={{ height: '100%', objectFit: 'cover' }}
                    />
                </Card>
            )}

            {/* <Typography
                sx={{
                    mt: 2,
                    fontSize: 18,
                    lineHeight: 1.6,
                    color: '#444'
                }}
            >
                {post.content}
            </Typography> */}

            <Typography
                sx={{
                    mt: 2,
                    fontSize: 18,
                    lineHeight: 1.6,
                    color: '#444'
                }}
                dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br />") }}
            />
        </Box>
    );
}

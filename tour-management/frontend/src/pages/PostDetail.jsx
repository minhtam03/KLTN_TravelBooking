import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress, Card, CardMedia, Chip, IconButton, Tooltip } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";
import moment from "moment";
import "../styles/post-detail.css";

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
                if (!response.ok) {
                    throw new Error("Failed to fetch post");
                }
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
        if (currentUser && likedUsers.includes(currentUser._id)) {
            setIsLiked(true);
        } else {
            setIsLiked(false);
        }
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

            if (!response.ok) {
                throw new Error("Failed to like/unlike post");
            }

            const updatedPost = await response.json();
            setLikeCount(updatedPost.data.likeCount);
            setLikedUsers(updatedPost.data.likedUsers);
        } catch (error) {
            console.error("Error liking/unliking post:", error);
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!post) return <Typography>Không tìm thấy bài viết</Typography>;

    return (
        <Box className="post-container">
            <Typography variant="h4" sx={{ fontWeight: "bold" }} className="post-title">{post.title}</Typography>

            {/* Hàng chứa ngày đăng và số lượt like */}
            <Box className="post-info">
                <Chip className="post-date"
                    label={moment(post.createdAt).format("DD/MM/YYYY")}
                    sx={{ backgroundColor: "#F1F3F4", fontSize: "0.9rem", fontWeight: 500 }}
                />
                <Box className="post-likes">
                    <Tooltip title={isLiked ? "Unlike" : "Like"}>
                        <IconButton onClick={onLikeBtnClick} color={isLiked ? "error" : "default"}>
                            <FavoriteIcon />
                            <Typography component="span" sx={{ marginLeft: 0.5 }}>
                                {likeCount}
                            </Typography>
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {post.photo && (
                <Card className="post-image">
                    <CardMedia component="img" image={post.photo} alt={post.title} />
                </Card>
            )}

            <Typography className="post-content">{post.content}</Typography>
        </Box>
    );
}

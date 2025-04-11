import React, { useState, useEffect, useContext } from 'react'
import {
  Avatar, Card, CardActions, CardContent,
  CardHeader, CardMedia, IconButton, Typography, Tooltip
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { AuthContext } from '../../../context/AuthContext';
import { BASE_URL } from '../../../utils/config';
import { Link } from 'react-router-dom';

export default function Post({ post }) {
  const { user: currentUser } = useContext(AuthContext);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [likedUsers, setLikedUsers] = useState(post.likedUsers || []);
  const [isLiked, setIsLiked] = useState(false);


  useEffect(() => {
    if (currentUser && likedUsers.includes(currentUser._id)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [currentUser, likedUsers]);


  // Hàm xử lý khi người dùng click vào like
  const onLikeBtnClick = async () => {
    if (!currentUser) {
      alert("Bạn cần đăng nhập để like bài viết!");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/posts/${post._id}/like`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser._id }) // Gửi userId hiện tại
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


  return (
    <Card sx={{ height: '100%', borderRadius: '12px' }}>

      {/* <CardHeader

      /> */}

      <Link to={`/post/${post._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {post.photo && (
          <CardMedia
            component="img"
            image={post.photo}
            alt={post.title}
            sx={{ height: '200px', objectFit: 'cover' }}
          />
        )}
      </Link>

      <CardContent>
        <Typography variant="h5">
          <Link to={`/post/${post._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {post.title}
          </Link>
        </Typography>
        <Typography variant="body2" paragraph>
          <Link to={`/post/${post._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}
          </Link>
        </Typography>
      </CardContent>

      {/* CardActions: Hiển thị các hành động như like */}
      <CardActions>
        <Tooltip title={isLiked ? "Unlike" : "Like"}>
          <IconButton onClick={onLikeBtnClick} color={isLiked ? "error" : "default"}>
            <FavoriteIcon />
            <Typography component="span" sx={{ marginLeft: 0.5 }}>
              {likeCount}
            </Typography>
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  )
}

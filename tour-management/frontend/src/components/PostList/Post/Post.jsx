import React from 'react'
import { Avatar, Card, CardActions, CardContent, CardHeader, CardMedia, IconButton, Typography } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function Post({ post }) {
    // Hàm xử lý khi người dùng click vào like
    const onLikeBtnClick = () => {
        
        console.log("Like button clicked");
    }

  return (
    <Card sx={{ height: '100%' }}>
      {/* CardHeader: Hiển thị tiêu đề bài viết, tác giả và ngày đăng */}
      <CardHeader
        avatar={<Avatar>{post.author.charAt(0)}</Avatar>}
        title={post.author}
        // subheader={moment(post.createdAt).format('HH:mm MMM DD, YYYY')} // Định dạng ngày giờ
        action={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
      />

      {/* CardMedia: Hiển thị ảnh đính kèm bài viết nếu có */}
      {post.attachment && (
        <CardMedia 
          component="img"
          image={post.attachment}
          alt={post.title}
          sx={{ height: '150px', objectFit: 'cover' }} 
        />
      )}

      {/* CardContent: Hiển thị tiêu đề, nội dung bài viết */}
      <CardContent>
        <Typography variant="h5" color="textPrimary">
          {post.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          {post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}
        </Typography>
      </CardContent>

      {/* CardActions: Hiển thị các hành động như like */}
      <CardActions>
        <IconButton onClick={onLikeBtnClick}>
          <FavoriteIcon />
          <Typography component="span" color="textSecondary">
            {post.likeCount}
          </Typography>
        </IconButton>
      </CardActions>
    </Card>
  )
}

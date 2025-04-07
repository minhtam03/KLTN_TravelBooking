// import React, { useEffect, useState } from 'react';
// import Slider from 'react-slick';
// import { BASE_URL } from '../../utils/config';
// import { Link } from 'react-router-dom';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';


// const Testimonials = () => {
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const res = await fetch(`${BASE_URL}/posts`);
//         const data = await res.json();
//         if (res.ok) {
//           setPosts(data.data.slice(0, 10));
//         }
//       } catch (error) {
//         console.error('Failed to fetch blog posts:', error);
//       }
//     };

//     fetchPosts();
//   }, []);

//   const settings = {
//     dots: true,
//     infinite: true,
//     autoplay: true,
//     speed: 1000,
//     swipeToSlide: true,
//     autoplaySpeed: 3000,
//     slidesToShow: 3,
//     responsive: [
//       { breakpoint: 992, settings: { slidesToShow: 2 } },
//       { breakpoint: 576, settings: { slidesToShow: 1 } },
//     ],
//   };

//   const formatDate = (dateStr) => {
//     const date = new Date(dateStr);
//     return date.toLocaleDateString('vi-VN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   return (
//     <Slider {...settings}>
//       {posts.map((post) => (
//         <div className="testimonial py-4 px-3" key={post._id}>
//           <Link to={`/post/${post._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
//             <div className='blog-slider-item'>
//               {post.photo && (
//                 <img
//                   src={post.photo}
//                   alt={post.title}
//                   className='w-100 rounded mb-3'
//                   style={{ height: '180px', objectFit: 'cover' }}
//                 />
//               )}
//               <h5 className="blog-title mb-2">{post.title}</h5>

//               <p className="blog-content text-muted mb-1">
//                 {post.content.length > 120
//                   ? post.content.substring(0, 120) + '...'
//                   : post.content}
//               </p>

//               {/* Thời gian và lượt thích */}
//               {/* <div className="d-flex justify-content-between align-items-center mt-2">
//                 <span className="d-flex align-items-center gap-1 text-muted">
//                   <AccessTimeIcon fontSize="small" />
//                   <small>{formatDate(post.createdAt)}</small>
//                 </span>
//                 <span className="d-flex align-items-center gap-1 text-muted">
//                   <FavoriteIcon fontSize="small" color="error" />
//                   <small>{post.likeCount || 0}</small>
//                 </span>
//               </div> */}
//             </div>
//           </Link>
//         </div>
//       ))}
//     </Slider>
//   );
// };

// export default Testimonials;

import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { BASE_URL } from '../../utils/config';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Stack,
  IconButton,
} from '@mui/material';

const Testimonials = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/posts`);
        const data = await res.json();
        if (res.ok) {
          setPosts(data.data.slice(0, 10));
        }
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    swipeToSlide: true,
    autoplaySpeed: 3000,
    slidesToShow: 3,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Slider {...settings}>
      {posts.map((post) => (
        <Box key={post._id} px={2} py={2}>
          <Link to={`/post/${post._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Card
              elevation={0} // 👈 Bỏ shadow
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'none',       // 👈 Bỏ shadow nếu có
                border: 'none',          // 👈 Bỏ border nếu có
                borderRadius: 0          // 👈 (tuỳ chọn) bỏ bo góc nếu cần
              }}
            >

              {post.photo && (
                <CardMedia
                  component="img"
                  height="200"
                  image={post.photo}
                  alt={post.title}
                  sx={{
                    objectFit: 'cover',
                    border: '1px solid #ddd',        // 👈 Viền mỏng
                    borderRadius: '8px',             // 👈 Bo góc nhẹ

                  }}                          // 👈 Khoảng cách với top (optional)
                />

              )}

              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  sx={{
                    minHeight: '48px',
                    maxHeight: '48px',
                    overflow: 'hidden',
                    lineHeight: 1.3,
                  }}
                >
                  {post.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    minHeight: '60px',
                    maxHeight: '60px',
                    overflow: 'hidden',
                    lineHeight: 1.4,
                    mb: 1,
                  }}
                >
                  {post.content.length > 120
                    ? post.content.substring(0, 120) + '...'
                    : post.content}
                </Typography>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mt="auto"
                >
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <AccessTimeIcon fontSize="small" />
                    <Typography variant="caption">{formatDate(post.createdAt)}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <FavoriteIcon fontSize="small" color="error" />
                    <Typography variant="caption">{post.likeCount || 0}</Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Link>
        </Box>
      ))}
    </Slider>
  );
};

export default Testimonials;



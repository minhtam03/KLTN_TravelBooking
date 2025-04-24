// import React, { useState, useEffect } from 'react';
// import Sidebar from '../../../components/admin/sidebar/Sidebar';
// import Navbar from '../../../components/admin/navbar/Navbar';
// import "../single/single.scss";
// import { useParams } from 'react-router-dom';
// import { BASE_URL } from '../../../utils/config';

// const SinglePost = () => {
//     const { id } = useParams();
//     const [post, setPost] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchPost = async () => {
//             try {
//                 const res = await fetch(`${BASE_URL}/posts/${id}`, {
//                     method: "GET",
//                     credentials: "include",
//                 });

//                 if (!res.ok) throw new Error("Failed to fetch post data");
//                 const result = await res.json();
//                 setPost(result.data);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchPost();
//     }, [id]);

//     return (
//         <div className="single">
//             <Sidebar />
//             <div className="singleContainer">
//                 <Navbar />
//                 <div className="top">
//                     <div className="left">
//                         <h1 className="title">Post Information</h1>
//                         {loading ? (
//                             <p>Loading post data...</p>
//                         ) : error ? (
//                             <p>Error: {error}</p>
//                         ) : (
//                             <div className="item">
//                                 <img
//                                     src={post?.photo || "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}
//                                     alt="Post"
//                                     className="itemImg"
//                                 />
//                                 <div className="details">
//                                     <h1 className="itemTitle">{post?.title || "Untitled Post"}</h1>

//                                     <div className="detailItem">
//                                         <span className="itemKey">Title:</span>
//                                         <span className="itemValue">{post?.title || "N/A"}</span>
//                                     </div>

//                                     <div className="detailItem">
//                                         <span className="itemKey">Author:</span>
//                                         <span className="itemValue">{post?.author || "N/A"}</span>
//                                     </div>

//                                     <div className="detailItem">
//                                         <span className="itemKey">Created At:</span>
//                                         <span className="itemValue">
//                                             {post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : "N/A"}
//                                         </span>
//                                     </div>

//                                     <div className="detailItem">
//                                         <span className="itemKey">Likes:</span>
//                                         <span className="itemValue">{post?.likeCount || 0}</span>
//                                     </div>


//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                     {/* <div className="right">

//                         <h1 className="title">Post Content</h1>
//                         <div className="contentBox">
//                             {loading ? (
//                                 <p>Loading...</p>
//                             ) : (
//                                 <p style={{ whiteSpace: 'pre-wrap' }}>{post?.content || "No content available."}</p>
//                             )}
//                         </div>
//                     </div> */}
//                 </div>

//                 <div className="bottom">
//                     <h1 className="title">Post Content</h1>
//                     <div className="contentBox">
//                         {loading ? (
//                             <p>Loading...</p>
//                         ) : (
//                             <p style={{ whiteSpace: 'pre-wrap' }}>{post?.content || "No content available."}</p>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SinglePost;

import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, Avatar, CircularProgress, Alert } from '@mui/material';
import Sidebar from '../../../components/admin/sidebar/Sidebar';
import Navbar from '../../../components/admin/navbar/Navbar';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../../utils/config';

const SinglePost = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`${BASE_URL}/posts/${id}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!res.ok) throw new Error('Failed to fetch post data');
                const result = await res.json();
                setPost(result.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    return (
        <Box display="flex">
            <Sidebar />
            <Box flex={6} p={3} sx={{ ml: "240px", flexGrow: 1 }}>
                <Navbar />
                <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3} mt={3}>
                    {/* Information Section */}
                    <Box flex={1} display="flex" flexDirection="column">
                        {loading ? (
                            <CircularProgress />
                        ) : error ? (
                            <Alert severity="error">Error: {error}</Alert>
                        ) : (
                            <Card sx={{ p: 3, borderRadius: 3 }}>
                                <Typography variant="h5" fontWeight={700} mb={2}>Post Information</Typography>
                                <Box display="flex" gap={3} alignItems="center" mb={3}>
                                    <Avatar
                                        variant="circular"
                                        src={post?.photo || 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'}
                                        sx={{ width: 64, height: 64 }}
                                    />
                                    <Box display="grid" gridTemplateColumns="auto 1fr" rowGap={1} columnGap={2}>
                                        <Typography variant="body2" fontWeight={600}>Title:</Typography>
                                        <Typography variant="body2">{post?.title || 'N/A'}</Typography>

                                        <Typography variant="body2" fontWeight={600}>Author:</Typography>
                                        <Typography variant="body2">{post?.author || 'N/A'}</Typography>

                                        <Typography variant="body2" fontWeight={600}>Created At:</Typography>
                                        <Typography variant="body2">
                                            {post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'N/A'}
                                        </Typography>

                                        <Typography variant="body2" fontWeight={600}>Likes:</Typography>
                                        <Typography variant="body2">{post?.likeCount || 0}</Typography>
                                    </Box>
                                </Box>
                            </Card>
                        )}
                    </Box>

                    {/* Content Section */}
                    <Box flex={2} display="flex" flexDirection="column">
                        <Card sx={{ p: 3, borderRadius: 3 }}>
                            <Typography variant="h5" fontWeight={700} mb={2}>Post Content</Typography>
                            {loading ? (
                                <CircularProgress />
                            ) : (
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                    {post?.content || 'No content available.'}
                                </Typography>
                            )}
                        </Card>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default SinglePost;


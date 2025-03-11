import Post from "../models/Post.js"

// create new post

export const createPost = async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save()
        res.status(200).json({
            success: true,
            message: "Successfully created post",
            data: savedPost,
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create post. Try again"
        })
    }
}


// get all post
export const getAllPosts = async (req, res) => {

    try {
        const posts = await Post.find();

        res.status(200).json({
            success: true,
            message: "Successfully fetched posts",
            data: posts,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch posts. Try again"
        })
    }
}


// get single post
export const getSinglePost = async (req, res) => {
    const id = req.params.id

    try {
        const post = await Post.findById(id)
        res.status(200).json({
            success: true,
            message: "Successful get single post",
            data: post,
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: "not found",
        })
    }
}

// update post
export const updatePost = async (req, res) => {
    const { id } = req.params;  // Get the post ID from the request parameters
    const { title, content, author, attachment, likeCount } = req.body;  // Get new data from request body

    try {
        // Find the post by ID and update it with the new data
        const updatedPost = await Post.findByIdAndUpdate(id, {
            title,
            content,
            author,
            attachment,
            likeCount
        }, { new: true });  // `new: true` will return the updated post

        // If the post is not found
        if (!updatedPost) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: updatedPost
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update post. Try again."
        });
    }
}

// Delete post
export const deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPost = await Post.findByIdAndDelete(id);

        if (!deletedPost) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Post deleted successfully",
            data: deletedPost
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete post. Try again.",
        });
    }
};


// Like post

// export const likePost = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const updatedPost = await Post.findByIdAndUpdate(
//             id,
//             { $inc: { likeCount: 1 } }, // Tăng likeCount lên 1
//             { new: true }
//         );

//         if (!updatedPost) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Post not found",
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Post liked successfully",
//             data: updatedPost
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Failed to like post. Try again.",
//         });
//     }
// };

export const likePost = async (req, res) => {
    const { id } = req.params;
    const userId = req.body.userId; // Lấy userId từ request body

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Kiểm tra xem user đã like chưa
        const alreadyLiked = post.likedUsers.includes(userId);

        if (alreadyLiked) {
            // Nếu đã like, bỏ like (Unlike)
            post.likeCount -= 1;
            post.likedUsers = post.likedUsers.filter((user) => user.toString() !== userId);
        } else {
            // Nếu chưa like, thêm vào danh sách
            post.likeCount += 1;
            post.likedUsers.push(userId);
        }

        await post.save();

        res.status(200).json({
            success: true,
            message: alreadyLiked ? "Post unliked" : "Post liked",
            data: post
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to like/unlike post. Try again." });
    }
};



// Get posts with pagination
export const getPostsPaginated = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Mặc định trang 1
    const limit = parseInt(req.query.limit) || 10; // Mặc định 10 bài/trang
    const skip = (page - 1) * limit;

    try {
        const posts = await Post.find().skip(skip).limit(limit);
        const totalPosts = await Post.countDocuments();

        res.status(200).json({
            success: true,
            message: "Successfully fetched posts with pagination",
            data: posts,
            totalPosts,
            totalPages: Math.ceil(totalPosts / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch posts. Try again.",
        });
    }
};

// Search posts
export const searchPosts = async (req, res) => {
    const { query } = req.query;

    try {
        const posts = await Post.find({
            $or: [
                { title: { $regex: query, $options: "i" } }, // Tìm theo title (không phân biệt chữ hoa/thường)
                { content: { $regex: query, $options: "i" } } // Tìm theo content
            ]
        });

        res.status(200).json({
            success: true,
            message: "Successfully fetched search results",
            data: posts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch search results. Try again.",
        });
    }
};

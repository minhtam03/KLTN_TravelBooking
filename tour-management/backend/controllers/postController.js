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

// delete post
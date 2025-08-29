// backend/controllers/postController.js
import Post from "../models/postModel.js";
import fs from "fs";
import path from "path";

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const postData = {
      title,
      content,
      author: req.user.id,
    };

    // Save uploaded image
    if (req.file) {
      postData.image = `/uploads/${req.file.filename}`;
    }

    const newPost = await Post.create(postData);
    await newPost.populate("author", "name email");

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .populate("comments.author", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

// Get single post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name email")
      .populate("comments.author", "name email");

    if (!post) return res.status(404).json({ error: "Post not found" });

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

// Update a post
export const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    if (req.file) {
      if (post.image) {
        const oldPath = path.join(process.cwd(), "backend", post.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      post.image = `/uploads/${req.file.filename}`;
    }

    post.title = title || post.title;
    post.content = content || post.content;

    const updatedPost = await post.save();
    await updatedPost.populate("author", "name email");

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: "Failed to update post" });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this post" });
    }

    if (post.image) {
      const filePath = path.join(process.cwd(), "backend", post.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Delete post error:", err);
    res.status(500).json({ message: "Server error while deleting post" });
  }
};

// Like/unlike post
export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likes.includes(userId);
    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add comment
export const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = {
      text: req.body.text,
      author: req.user.id,
    };

    post.comments.push(comment);
    await post.save();
    await post.populate("comments.author", "name email");

    res.status(200).json({ message: "Comment added successfully", post });
  } catch (error) {
    console.error("Comment error:", error);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

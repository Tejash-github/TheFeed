// routes/comments.js
const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Add a comment
router.post('/:postId', async (req, res) => {
    const { content } = req.body;
    const newComment = new Comment({ content, author: req.user._id, post: req.params.postId });
    await newComment.save();

    // Update the post to include the new comment
    await Post.findByIdAndUpdate(req.params.postId, { $push: { comments: newComment._id } });

    res.redirect(`/posts/${req.params.postId}`);
});

// Delete a comment
router.delete('/:commentId', async (req, res) => {
    const comment = await Comment.findById(req.params.commentId);
    await Post.findByIdAndUpdate(comment.post, { $pull: { comments: comment._id } });
    await Comment.findByIdAndDelete(req.params.commentId);
    res.redirect(`/posts/${comment.post}`);
});

module.exports = router;
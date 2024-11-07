// routes/posts.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Get all posts
router.get('/', async (req, res) => {
    const posts = await Post.find().populate('author');
    res.render('posts/index', { posts });
});

// Create a new post
router.get('/new', (req, res) => {
    res.render('posts/new');
});

router.post('/', async (req, res) => {
    const { title, content } = req.body;
    const newPost = new Post({ title, content, author: req.user._id });
    await newPost.save();
    res.redirect('/posts');
});

// View a single post
router.get('/:id', async (req, res) => {
    const post = await Post.findById(req.params.id).populate('author').populate({
        path: 'comments',
        populate: { path: 'author' }
    });
    res.render('posts/show', { post });
});

// Search for posts
router.get('/search', async (req, res) => {
    const { query } = req.query;
    const posts = await Post.find({ title: { $regex: query, $options: 'i' } }).populate('author');
    res.render('posts/index', { posts });
});

// Edit a post
router.get('/:id/edit', async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('posts/edit', { post });
});

router.put('/:id', async (req, res) => {
    const { title, content } = req.body;
    await Post.findByIdAndUpdate(req.params.id, { title, content });
    res.redirect(`/posts/${req.params.id}`);
});

// Delete a post
router.delete('/:id', async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/posts');
});

module.exports = router;
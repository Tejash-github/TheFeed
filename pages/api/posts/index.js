// pages/api/posts/index.js
import dbConnect from '../../../lib/db';
import Post from '../../../models/Post';


export default async function handler(req, res) {
  await dbConnect();

    

  if (req.method === 'GET') {
    try {
      const posts = await Post.find({});
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ message: 'Error fetching posts' });
    }
  } else if (req.method === 'POST') {
    try {
      const post = new Post(req.body);
      await post.save();
      res.status(201).json(post);
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ message: 'Error creating post' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
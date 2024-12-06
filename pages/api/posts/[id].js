// pages/api/posts/[id].js
import dbConnect from '../../../lib/db';
import Post from '../../../models/Post';

export default async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();

  if (req.method === 'DELETE') {
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    return res.status(204).end(); // No content
  }

  res.setHeader('Allow', ['DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
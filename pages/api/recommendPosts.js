// pages/api/recommendPosts.js
import dbConnect from '../../lib/db';
import Post from '../../models/Post';
import User from '../../models/User';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { userId } = req.query; // Expecting userId as a query parameter

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User  not found' });
      }

      // Sort tags by interaction time and get the top tags
      const sortedTags = Object.entries(user.tagInteractions)
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0])
        .slice(0, 5); // Get top 5 tags

        const topPostId = sortedPostIds[0];

      // Find the top post to get its tags
      const topPost = await Post.findById(topPostId ).lean();

      if (!topPost) {
        return res.status(404).json({ message: 'Top post not found' });
      }

      // Find posts that match the top tags
      const recommendedPosts = await Post.find({ tags: { $in: sortedTags, $in: topPost.tags  } }).sort({ createdAt: -1 });

      return res.status(200).json(recommendedPosts);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching recommended posts', error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
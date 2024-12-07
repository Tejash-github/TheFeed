// pages/api/logPostInteraction.js
import dbConnect from '../../lib/db';
import User from '../../models/User';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { userId, postId } = req.body; // Expecting userId and postId

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User  not found' });
      }

      // Update the post interaction count
      user.postInteractions[postId] = (user.postInteractions[postId] || 0) + 1;
      await user.save();

      return res.status(200).json({ message: 'Post interaction logged successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Error logging post interaction', error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
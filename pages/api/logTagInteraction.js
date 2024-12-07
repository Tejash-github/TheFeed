// pages/api/logTagInteraction.js
import dbConnect from '../../lib/db';
import User from '../../models/User'; // Assuming you have a User model

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { userId, tag, duration } = req.body; // Expecting userId, tag, and duration

    try {
      // Find the user and update their tag interaction data
      const user = await User.findById(userId);
 if (!user) {
        return res.status(404).json({ message: 'User  not found' });
      }

      // Update the user's tag interaction data
      user.tagInteractions[tag] = (user.tagInteractions[tag] || 0) + duration;
      await user.save();

      return res.status(200).json({ message: 'Tag interaction logged successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Error logging tag interaction', error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
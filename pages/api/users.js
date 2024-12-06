// pages/api/users.js
import dbConnect from '../../lib/db'; // Ensure you have this import
import User from '../../models/User'; // Import the User model

export default async function handler(req, res) {
  await dbConnect(); // Connect to the database

  if (req.method === 'GET') {
    try {
      const users = await User.find().select('-password'); // Fetch all users, excluding passwords
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
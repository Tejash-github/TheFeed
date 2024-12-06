// pages/api/user/[id].js
import dbConnect from '../../../lib/db'; // Ensure you have this import
import User from '../../../models/User'; // Import the User model

export default async function handler(req, res) {
  await dbConnect(); // Connect to the database

  const { id } = req.query; // Get the user ID from the query parameters

  if (req.method === 'DELETE') {
    try {
      const deletedUser  = await User.findByIdAndDelete(id); // Delete the user by ID
      if (!deletedUser ) {
        return res.status(404).json({ message: 'User  not found' });
      }
      return res.status(200).json({ message: 'User  deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ message: 'Error deleting user' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
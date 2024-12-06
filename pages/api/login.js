// pages/api/login.js
import { users } from '../../data'; // Assuming you have a mock database
import User from '../../models/User'; // Import the User model
import bcrypt from 'bcrypt'; // Import bcrypt for password comparison

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email }); // Use the User model to find the user

    // Check if user exists and password matches
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password); // Compare the hashed password
      if (isMatch) {
        // Return user data (omit password for security)
        const { password, ...userData } = user.toObject(); // Convert Mongoose document to plain object
        return res.status(200).json(userData);
      }
    }
    return res.status(401).json({ message: 'Invalid credentials' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}


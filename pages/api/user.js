// pages/api/user.js
import dbConnect from '../../lib/db'; // Ensure you have this import
import User from '../../models/User'; // Import the User model

export default async function handler(req, res) {
    await dbConnect(); // Connect to the database

    if (req.method === 'GET') {
        // Assuming you want to get the logged-in user's data
        const userId = req.query.id; // Get user ID from query parameters

        if (!userId) {
            return res.status(400).json({ message: 'User  ID is required'});
        }

        try {
            const user = await User.findById(userId).select('-password'); // Exclude password from response
            if (!user) {
                return res.status(404).json({ message: 'User  not found'});
            }
            return res.status(200).json(user);
        } catch (error) {
            console.error('Error fetching user:', error);
            return res.status(500).json({ message: 'Error fetching user'});
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
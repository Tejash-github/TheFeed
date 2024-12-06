// pages/api/users/[id].js
import dbConnect from '../../../lib/db';
import User from '../../../models/User';

export default async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();

  if (req.method === 'DELETE') {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User  not found' });
    }
    return res.status(204).end(); // No content
  }

  res.setHeader('Allow', ['DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
// pages/api/login.js
import { users } from '../../data'; 
import User from '../../models/User'; 
import bcrypt from 'bcrypt'; 

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;


    const user = await User.findOne({ email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
       
        const { password, ...userData } = user.toObject();
        return res.status(200).json(userData);
      }
    }
    return res.status(401).json({ message: 'Invalid credentials' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}


// pages/api/adminLogin.js
export default function handler(req, res) {
    if (req.method === 'POST') {
      const { userId, password } = req.body;
  
      // Hardcoded credentials
      const hardcodedUserId = 'admin';
      const hardcodedPassword = 'password123';
  
      // Check for hardcoded user credentials
      if (userId === hardcodedUserId && password === hardcodedPassword) {
        // Return user data (omit password for security)
        const userData = { userId: hardcodedUserId, name: 'Admin User' };
        return res.status(200).json(userData);
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
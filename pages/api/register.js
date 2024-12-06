// pages/api/register.js
import { IncomingForm } from 'formidable';
import fs from 'fs';
import dbConnect from '../../lib/db'; // Ensure you have this import
import User from '../../models/User'; // Import the User model
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
  },
};

export default async function handler(req, res) {
  await dbConnect(); // Connect to the database

  if (req.method === 'POST') {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing the files:', err);
        return res.status(500).json({ message: 'Error parsing the files' });
      }

      console.log('Parsed Fields:', fields); // Log the parsed fields

      // Access the first element of each array
      const name = fields.name[0];
      const email = fields.email[0];
      const password = fields.password[0];
      const profilePicture = files.profilePicture[0];

      // Check if profilePicture is defined
      if (!profilePicture) {
        return res.status(400).json({ message: 'Profile picture is required' });
      }

      // Check if user already exists
      const existingUser  = await User.findOne({ email });
      if (existingUser ) {
        return res.status(409).json({ message: 'User  already exists' });
      }

      // Ensure the uploads directory exists
      const uploadsDir = './public/uploads';
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Move the uploaded file to a public directory (e.g., /public/uploads)
      const newFilePath = `${uploadsDir}/${profilePicture.name}`;
      fs.rename(profilePicture.filepath, newFilePath, (renameErr) => {
        if (renameErr) {
          console.error('Error moving the file:', renameErr);
          return res.status(500).json({ message: 'Error moving the file' });
        }

        // Check if password is defined and is a string
        if (!password || typeof password !== 'string') {
          return res.status(400).json({ message: 'Password is required and must be a string' });
        }

        // Hash the password before saving
        bcrypt.hash(password, 10, async (hashErr, hashedPassword) => {
          if (hashErr) {
            console.error('Error hashing password:', hashErr);
            return res.status(500).json({ message: 'Error hashing password' });
          }

          // Create a new user
          const newUser  = new User({
            name,
            email,
            password: hashedPassword,
            profilePicture: `/uploads/${profilePicture.name}`, // Store the path to the profile picture
          });

          try {
            await newUser .save(); // Save the user to the database
            return res.status(201).json({ message: 'User  registered successfully' });
          } catch (saveErr) {
            console.error('Error saving user:', saveErr);
            return res.status(500).json({ message: 'Error saving user' });
          }
        });
      });
    });
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
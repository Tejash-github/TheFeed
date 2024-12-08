// pages/api/register.js
import { IncomingForm } from 'formidable';
import fs from 'fs';
import dbConnect from '../../lib/db';
import User from '../../models/User';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

export const config = {
  api: {
    bodyParser: false,
  },
};


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing the files:', err);
        return res.status(500).json({ message: 'Error parsing the files' });
      }

      const name = fields.name[0];
      const email = fields.email[0];
      const password = fields.password[0];
      const profilePicture = files.profilePicture[0];

      if (!profilePicture) {
        return res.status(400).json({ message: 'Profile picture is required' });
      }

      const existingUser  = await User.findOne({ email });
      if (existingUser ) {
        return res.status(409).json({ message: 'User  already exists' });
      }

      const uploadsDir = './public/uploads';
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const newFilePath = `${uploadsDir}/${profilePicture.name}`;
      fs.renameSync(profilePicture.filepath, newFilePath);

      if (!password || typeof password !== 'string') {
        return res.status(400).json({ message: 'Password is required and must be a string' });
      }


      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user without OTP
      await User.create({
        name,
        email,
        password: hashedPassword,
        profilePicture: `/uploads/${profilePicture.name}`,
      });

    
      const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to The Feed</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
              }
              .container {
                  width: 100%;
                  max-width: 600px;
                  margin: auto;
                  background: white;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                  text-align: center;
                  padding: 10px 0;
              }
              .header img {
                  max-width: 150px; /* Adjust logo size */
              }
              .content {
                  margin: 20px 0;
              }
              .footer {
                  text-align: center;
                  font-size: 12px;
                  color: #777;
                  margin-top: 20px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="http://localhost:3000/logo.png" alt="Logo" />
              </div>
              <div class="content">
                  <h1>Welcome to The Feed!</h1>
                  <p>Thank you for registering, <strong>${name}</strong>!</p>
                  <p>We are excited to have you on board. Explore our platform and start sharing your thoughts.</p>
              </div>
              <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} The Feed. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
      `;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to The Feed!',
        html: htmlContent,
      });

      return res.status(201).json({ message: 'User  registered successfully.' });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
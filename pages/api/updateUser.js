// pages/api/updateUser .js
import { IncomingForm } from 'formidable';
import fs from 'fs';
import dbConnect from '../../lib/db';
import User from '../../models/User';

export const config = {
    api: {
        bodyParser: false, // Disable the default body parser
    },
};

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'PUT') {
        const form = new IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Error parsing the files:', err);
                return res.status(500).json({ message: 'Error parsing the files' });
            }

            const { id, name, email } = fields;
            const profilePicture = files.profilePicture ? files.profilePicture[0] : null;

            try {
                // Ensure the uploads directory exists
                const uploadsDir = './public/uploads';
                if (!fs.existsSync(uploadsDir)) {
                    fs.mkdirSync(uploadsDir, { recursive: true });
                }

                let newProfilePicturePath = null;
                if (profilePicture) {
                    // Move the uploaded file to the uploads directory
                    newProfilePicturePath = `${uploadsDir}/${profilePicture.name}`;
                    fs.renameSync(profilePicture.filepath, newProfilePicturePath);
                }

                const updatedUser  = await User.findByIdAndUpdate(
                    id,
                    {
                        name: Array.isArray(name) ? name[0] : name,
                        email: Array.isArray(email) ? email[0] :email,
                        profilePicture: newProfilePicturePath ? `/uploads/${profilePicture.name}` : undefined,
                    },
                    { new: true } // Return the updated document
                );

                if (!updatedUser ) {
                    return res.status(404).json({ message: 'User  not found' });
                }

                res.status(200).json(updatedUser );
            } catch (error) {
                console.error('Error updating user:', error); // Log the error details
                res.status(500).json({ message: 'Error updating user', error: error.message });
            }
        });
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
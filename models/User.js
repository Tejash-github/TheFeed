// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, required: true },
  tagInteractions: { type: Object, default: {} },
  postInteractions: { type: Object, default: {} },
  confirmationToken: { type: String },
  isConfirmed: { type: Boolean, default: false },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
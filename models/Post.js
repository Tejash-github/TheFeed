// models/Post.js
import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  tags: { type: [String], required: true, default: [] },
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
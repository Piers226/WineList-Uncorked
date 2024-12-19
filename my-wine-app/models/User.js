// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    userId: { type: String, unique: true, required: true }, // Google ID
    userName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
  });
  
  export default mongoose.models.User || mongoose.model('User', UserSchema);
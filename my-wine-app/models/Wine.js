// models/Wine.js
import mongoose from 'mongoose';

const WineSchema = new mongoose.Schema({
  name: { type: String, required: true },
    grape: { type: String },
  notes: { type: String },
  rating: { type: Number, min: 0, max: 100 },
  userId: { type: String, required: true }, // user who created this entry
  username: { type: String, required: true }, // username of the user who created this entry
}, { timestamps: true });

export default mongoose.models.Wine || mongoose.model('Wine', WineSchema);
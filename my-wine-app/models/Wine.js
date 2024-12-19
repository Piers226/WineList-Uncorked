// models/Wine.js
import mongoose from 'mongoose';

const WineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  notes: { type: String },
  rating: { type: Number, min: 0, max: 100 },
  userId: { type: String, required: true }, // user who created this entry
}, { timestamps: true });

export default mongoose.models.Wine || mongoose.model('Wine', WineSchema);
// models/Wine.js
import mongoose from 'mongoose';

const WineSchema = new mongoose.Schema({
  display_name: { type: String, required: true },
  lwin: { type: String },
  producer_name: { type: String },
  wine: { type: String },
  country: { type: String },
  region: { type: String },
  sub_region: { type: String },
  color: { type: String },
  type: { type: String },
  sub_type: { type: String },
  designation: { type: String },
  classification: { type: String },
  date_added: { type: String },
  date_updated: { type: String },
  general_notes: { type: String },
  rating: { type: Number, min: 0, max: 10 },
  createdByUserId: { type: String, required: true }, // user who created this entry
  createdByUsername: { type: String, required: true }, // username of the user who created this entry
}, { timestamps: true });

export default mongoose.models.Wine || mongoose.model('Wine', WineSchema);
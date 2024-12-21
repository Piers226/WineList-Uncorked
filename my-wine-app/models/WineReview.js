// models/WineReview.js
import mongoose from 'mongoose';

const WineReviewSchema = new mongoose.Schema({
wineId: { type: String, required: true },
  display_name: { type: String, required: true },
  wine: { type: String },
  notes: { type: String },
  rating: { type: Number, min: 0, max: 10 },
  userId: { type: String, required: true }, // user who created this entry
  username: { type: String, required: true }, // username of the user who created this entry
}, { timestamps: true });

export default mongoose.models.WineReview || mongoose.model('WineReview', WineReviewSchema);
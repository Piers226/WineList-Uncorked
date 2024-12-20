// pages/api/wines/top.js
import { connectToDB } from "../../../lib/mongodb";
import Wine from "../../../models/Wine";

export default async function handler(req, res) {
  await connectToDB();
  const wines = await Wine.find().sort({ rating: -1 }).limit(10); // Top 10
  res.status(200).json(wines);
}
// pages/api/wines/search.js
import { connectToDB } from "../../../lib/mongodb";
import Wine from "../../../models/Wine";

export default async function handler(req, res) {
  await connectToDB();

  const { query, page = 1, limit = 10 } = req.query; // Default values for page and limit
  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "Query parameter is required" });
  }
  try {
    const wines = await Wine.find({
      $or: [
        { display_name: { $regex: query, $options: "i" } },
        { wine: { $regex: query, $options: "i" } },
        { producer_name: { $regex: query, $options: "i" } }
      ],
    }).sort({ rating: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
    res.status(200).json(wines);
  } catch (error) {
    console.error("Error searching wines:", error);
    res.status(500).json({ error: "Failed to search wines" });
  }
}
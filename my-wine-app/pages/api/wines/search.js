import { connectToDB } from "../../../lib/mongodb";
import Wine from "../../../models/Wine";

export default async function handler(req, res) {
  await connectToDB();

  const { query, page = 1, limit = 10 } = req.query; // Default values for page and limit

  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    // Perform case-insensitive search across multiple fields
    const regex = new RegExp(query, "i");

    // Get total results count
    const totalResults = await Wine.countDocuments({
      $or: [
        { display_name: regex },
        { wine: regex },
        { producer_name: regex },
      ],
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalResults / limit);

    // Fetch paginated results
    const wines = await Wine.find({
      $or: [
        { display_name: regex },
        { wine: regex },
        { producer_name: regex },
      ],
    })
      .sort({ rating: -1 }) // Sort by highest rated
      .skip((page - 1) * limit) // Implement pagination
      .limit(parseInt(limit));

    res.status(200).json({ wines, totalPages, totalResults, currentPage: page });
  } catch (error) {
    console.error("Error searching wines:", error);
    res.status(500).json({ error: "Failed to search wines" });
  }
}
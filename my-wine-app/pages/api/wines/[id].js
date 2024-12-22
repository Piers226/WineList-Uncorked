import { connectToDB } from "../../../lib/mongodb";
import Wine from "../../../models/Wine";
import WineReview from "../../../models/WineReview";

export default async function handler(req, res) {
  const { id } = req.query;

  await connectToDB();

  if (req.method === "GET") {
    try {
      // Fetch the wine by ID
      console.log("id:", id);
      const wine = await Wine.findById(id);
      if (!wine) return res.status(404).json({ error: "Wine not found" });

      // Fetch reviews for the wine
      const reviews = await WineReview.find({ wineId: id }).sort({ createdAt: -1 });

      return res.status(200).json({ wine, reviews });
    } catch (error) {
      console.error("Error fetching wine details:", error);
      return res.status(500).json({ error: "Failed to fetch wine details" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { connectToDB } from "../../lib/mongodb";
import WineReview from "../../models/WineReview";
import Wine from "../../models/Wine";

export default async function handler(req, res) {
  await connectToDB();

  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: "Not logged in" });
    

    const { wineId, display_name, wine, notes, rating } = req.body;

    if (!wineId || !display_name || !rating) {
        return res.status(400).json({ error: "Wine ID, Display Name, and Rating are required!" });
    }

    try {
        const review = new WineReview({
            wineId,
            display_name,
            wine,
            notes,
            rating: Number(rating),
            userId: session.userId,
            username: session.user.name,
          });
      await review.save();
      // Calculate the average rating
      const reviews = await WineReview.find({ wineId });
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;

      // Update the wine's rating
      await Wine.findByIdAndUpdate(wineId, { rating: averageRating.toFixed(2) });

      res.status(201).json({ review, averageRating });
    } catch (error) {
        console.error("Error saving review:", error.message, error.stack);
        res.status(500).json({ error: "Error creating review", details: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
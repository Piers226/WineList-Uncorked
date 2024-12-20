// pages/api/users/saveWine.js
import { connectToDB } from "../../../lib/mongodb";
import User from "../../../models/User";
import Wine from "../../../models/Wine";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  const { wineId } = req.body; // ID of the wine to save
  await connectToDB();

  const wine = await Wine.findById(wineId);
  if (!wine) return res.status(404).json({ error: "Wine not found" });

  // Find the user and update their savedWines array
  const user = await User.findOneAndUpdate(
    { userId: session.userId },
    { $addToSet: { savedWines: wine._id } }, // Prevent duplicates
    { new: true }
  );

  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json(user);
}
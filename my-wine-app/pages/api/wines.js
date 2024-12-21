// pages/api/wines.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { connectToDB } from "../../lib/mongodb";
import Wine from "../../models/Wine";
import User from "../../models/User";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  await connectToDB();
  
  if (req.method === "GET") {
    try {
      const wines = await Wine.find({
        display_name: { 
          $exists: true, // Ensure the field exists
          $nin: [null, "", 'NaN'] // Exclude null, empty string, and the string "NaN"
        }
      })
        .sort({ createdAt: -1 }) // Sort by newest first
        .limit(50); // Limit to 50 results
      return res.status(200).json(wines);
    } catch (error) {
      console.error("Error fetching wines:", error);
      return res.status(500).json({ error: "Failed to fetch wines" });
    }
  }

  if (req.method === "POST") {
    if (!session) return res.status(401).json({ error: "Not logged in" });

    const {
      display_name,
      lwin,
      producer_name,
      wine,
      country,
      region,
      sub_region,
      color,
      type,
      sub_type,
      designation,
      classification,
      date_added,
      date_updated,
      general_notes,
      rating,
    } = req.body;

    try {
      // Create a new wine entry
      const newWine = new Wine({
        display_name,
        lwin,
        producer_name,
        wine,
        country,
        region,
        sub_region,
        color,
        type,
        sub_type,
        designation,
        classification,
        date_added,
        date_updated,
        general_notes,
        rating,
        createdByUserId: session.userId,
        createdByUsername: session.user.name,
      });

      // Save the new wine entry
      await newWine.save();

      // Automatically save the wine for the user who created it
      await User.findOneAndUpdate(
        { userId: session.userId },
        { $addToSet: { savedWines: newWine._id } }, // Avoid duplicates
        { new: true }
      );

      return res.status(201).json(newWine);
    } catch (error) {
      console.error("Error creating wine:", error);
      return res.status(500).json({ error: "Failed to create wine" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
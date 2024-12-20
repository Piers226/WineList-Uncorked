// pages/api/users/savedWines.js
import { connectToDB } from "../../../lib/mongodb";
import User from "../../../models/User";
import Wine from "../../../models/Wine";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: "Not authenticated" });
  
    await connectToDB();
  
    if (req.method === 'GET') {
      // Fetch saved wines
      const user = await User.findOne({ userId: session.userId }).populate("savedWines");
      if (!user) return res.status(404).json({ error: "User not found" });
      return res.status(200).json(user.savedWines);
    }
  
    if (req.method === 'DELETE') {
      // Remove a wine from saved wines
      const { wineId } = req.body;
      const user = await User.findOneAndUpdate(
        { userId: session.userId },
        { $pull: { savedWines: wineId } },
        { new: true }
      );
  
      if (!user) return res.status(404).json({ error: "User not found" });
      return res.status(200).json(user.savedWines);
    }
  
    res.status(405).json({ error: "Method not allowed" });
  }
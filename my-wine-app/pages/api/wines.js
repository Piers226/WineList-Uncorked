// pages/api/wines.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { connectToDB } from "../../lib/mongodb";
import Wine from "../../models/Wine";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  await connectToDB();
  
  if (req.method === "GET") {
    const wines = await Wine.find().sort({ createdAt: -1 });
    return res.status(200).json(wines);
  }

  if (req.method === "POST") {
    if (!session) return res.status(401).json({ error: "Not logged in" });
    const { name, notes, rating } = req.body;
    const newWine = new Wine({
      name,
      notes,
      rating,
      userId: session.userId
    });
    await newWine.save();
    return res.status(201).json(newWine);
  }

  res.status(405).json({ error: "Method not allowed" });
}
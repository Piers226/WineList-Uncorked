// pages/api/wines/search.js
import { connectToDB } from "../../../lib/mongodb";
import Wine from "../../../models/Wine";

export default async function handler(req, res) {
  await connectToDB();

  const { query } = req.query;
  const wines = await Wine.find({
    $or: [
      { display_name: { $regex: query, $options: "i" } }, // case-insensitive search
      { wine: { $regex: query, $options: "i" } },
    ],
  });

  res.status(200).json(wines);
}
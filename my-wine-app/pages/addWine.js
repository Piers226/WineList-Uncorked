/* eslint-disable */

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";

export default function AddWine() {
  const { data: session } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [grape, setGrape] = useState("");
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState("");


  const grapesList = [
    "Cabernet Sauvignon",
    "Merlot",
    "Pinot Noir",
    "Syrah/Shiraz",
    "Zinfandel",
    "Sangiovese",
    "Nebbiolo",
    "Tempranillo",
    "Grenache",
    "Malbec",
    "Chardonnay",
    "Sauvignon Blanc",
    "Riesling",
    "Pinot Grigio/Pinot Gris",
    "Gewürztraminer",
    "Viognier",
    "Chenin Blanc",
    "Semillon",
    "Muscat",
    "Albariño",
  ];

  if (!session) {
    return (
      <p>
        You must be logged in to add a wine. <a href="/">Back Home</a>
      </p>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // Input validation
    if (!name || !grape || !rating) {
      alert("All fields are required!");
      return;
    }

    if (rating < 0 || rating > 100) {
      alert("Rating must be between 0 and 100.");
      return;
    }
    const res = await fetch("/api/wines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, notes, grape, rating: parseInt(rating) }),
    });
    if (res.ok) {
      router.push("/");
    } else {
      alert("Error adding wine");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Add a Wine</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Grape:</label>
          <select value={grape} onChange={(e) => setGrape(e.target.value)}>
            <option value="">Select a grape</option>
            {grapesList.map((grapeOption) => (
              <option key={grapeOption} value={grapeOption}>
                {grapeOption}
              </option>
            ))}
          </select>
          {grape === "Other" && (
            <div>
              <label>Specify Grape:</label>
              <input value={grape} onChange={(e) => setGrape(e.target.value)} />
            </div>
          )}
        </div>
        <div>
          <label>Notes:</label>
          <input value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div>
          <label>Rating (0-100):</label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </div>
        <button type="submit">Add Wine</button>
        <button type="button" onClick={() => router.push("/")}>
          Cancel
        </button>
      </form>
    </div>
  );
}

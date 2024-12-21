/* eslint-disable */

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";

export default function AddWine() {
  const { data: session } = useSession();
  const router = useRouter();

  // State for wine fields
  const [display_name, setDisplayName] = useState("");
  const [producer_name, setProducerName] = useState("");
  const [wine, setWine] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [sub_region, setSubRegion] = useState("");
  const [color, setColor] = useState("");
  const [type, setType] = useState("");
  const [general_notes, setGeneralNotes] = useState("");
  const [rating, setRating] = useState("");

  const colors = ["Red", "White", "Rosé", "Sparkling"];
  const types = ["Still", "Sparkling", "Dessert", "Fortified"];

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
    if (!display_name || !producer_name || !rating) {
      alert("Display Name, Producer Name, and Rating are required!");
      return;
    }
  
    const parsedRating = parseFloat(rating).toFixed(2); // Ensure two decimal places
  
    if (parsedRating < 0 || parsedRating > 10) {
      alert("Rating must be between 0 and 10.");
      return;
    }
  
    const newWine = {
      display_name,
      producer_name,
      wine,
      country,
      region,
      sub_region,
      color,
      type,
      general_notes,
      rating: Number(parsedRating), // Ensure it's stored as a Number
    };
  
    const res = await fetch("/api/wines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newWine),
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
          <label>Display Name:</label>
          <input
            value={display_name}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div>
          <label>Producer Name:</label>
          <input
            value={producer_name}
            onChange={(e) => setProducerName(e.target.value)}
          />
        </div>
        <div>
          <label>Wine:</label>
          <input value={wine} onChange={(e) => setWine(e.target.value)} />
        </div>
        <div>
          <label>Country:</label>
          <input value={country} onChange={(e) => setCountry(e.target.value)} />
        </div>
        <div>
          <label>Region:</label>
          <input value={region} onChange={(e) => setRegion(e.target.value)} />
        </div>
        <div>
          <label>Sub-Region:</label>
          <input
            value={sub_region}
            onChange={(e) => setSubRegion(e.target.value)}
          />
        </div>
        <div>
          <label>Color:</label>
          <select value={color} onChange={(e) => setColor(e.target.value)}>
            <option value="">Select a color</option>
            {colors.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Select a type</option>
            {types.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>General Notes:</label>
          <textarea
            value={general_notes}
            onChange={(e) => setGeneralNotes(e.target.value)}
          />
        </div>
        <div>
          <label>Rating (0-10):</label>
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
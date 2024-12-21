/* eslint-disable */

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";

export default function AddReview() {
  const { data: session } = useSession();
  const router = useRouter();
  const { wineId } = router.query;

  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState("");

  if (!session) {
    return (
      <p>
        You must be logged in to add a review. <a href="/">Back Home</a>
      </p>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!rating || parseFloat(rating) < 0 || parseFloat(rating) > 10) {
      alert("Rating must be between 0 and 10.");
      return;
    }

    const parsedRating = parseFloat(rating).toFixed(2);

    const newReview = {
        wineId: wineId,
      display_name: "Placeholder Wine display name", // Can replace this with additional fetch logic
      wine: "Placeholder Wine Name",
      notes,
      rating: Number(parsedRating),
    };

    const res = await fetch("/api/winereviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReview),
    });

    if (res.ok) {
      router.push("/");
    } else {
      alert("Error adding review");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Add a Review</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Notes:</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div>
          <label>Rating (0-10):</label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </div>
        <button type="submit">Add Review</button>
        <button type="button" onClick={() => router.push("/")}>
          Cancel
        </button>
      </form>
    </div>
  );
}
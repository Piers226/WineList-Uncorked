import { useEffect, useState } from "react";

export default function SavedWines() {
  const [savedWines, setSavedWines] = useState([]);

  useEffect(() => {
    fetchSavedWines();
  }, []);

  async function fetchSavedWines() {
    const res = await fetch("/api/users/savedWines");
    const data = await res.json();
    setSavedWines(data);
  }

  async function removeWine(wineId) {
    const res = await fetch("/api/users/savedWines", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wineId }),
    });
    if (res.ok) {
      setSavedWines(savedWines.filter((wine) => wine._id !== wineId));
      //alert("Wine removed!");
    } else {
      alert("Error removing wine");
    }
  }

  return (
    <div>
      <h1>Your Saved Wines</h1>
      <ul>
        {savedWines.map((wine) => (
          <li key={wine._id}>
            <strong>{wine.display_name}</strong> - {wine.wine} - {wine.region} ({wine.rating})
            <button onClick={() => removeWine(wine._id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
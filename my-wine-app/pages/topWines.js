// pages/topWines.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function TopWines() {
  const [wines, setWines] = useState([]);
  const [savedWineIds, setSavedWineIds] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/wines/top")
      .then((res) => res.json())
      .then((data) => setWines(data));
      // Fetch user's saved wines
      fetch("/api/users/savedWines")
        .then((res) => res.json())
        .then((data) => setSavedWineIds(data.map((wine) => wine._id)));
  }, []);

  async function saveWine(wineId) {
    const res = await fetch("/api/users/saveWine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wineId }),
    });
    if (res.ok) {
        setSavedWineIds([...savedWineIds, wineId]);
      //alert("Wine saved!");
    } else {
      alert("Error saving wine");
    }
  }


  return (
    <div>
      <h1>Top Rated Wines</h1>
      <ul>
        {wines.map((wine) => (
          <li key={wine._id}>
            <strong>{wine.display_name}</strong> - {wine.wine} - {wine.region} ({wine.rating})
            {savedWineIds.includes(wine._id) ? (
                <span style={{ color: "green" }}> ✔</span>
              ) : (
                <button onClick={() => saveWine(wine._id)}>Save</button>
              )}
              <button onClick={() => router.push(`/addReview?wineId=${wine._id}`)}>
                Add Review
              </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
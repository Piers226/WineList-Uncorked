// pages/searchWines.js
import { useState } from "react";

export default function SearchWines() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [savedWineIds, setSavedWineIds] = useState([]);

  async function search() {
    const res = await fetch(`/api/wines/search?query=${query}`);
    const data = await res.json();
    setResults(data);
    // Fetch user's saved wines
    fetch("/api/users/savedWines")
    .then((res) => res.json())
    .then((data) => setSavedWineIds(data.map((wine) => wine._id)));
  }

  async function saveWine(wineId) {
    const res = await fetch("/api/users/saveWine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wineId }),
    });
    if (res.ok) {
      //alert("Wine saved!");
    } else {
      alert("Error saving wine");
    }
  }

  return (
    <div>
      <h1>Search Wines</h1>
      <input
        type="text"
        placeholder="Search by name or grape"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={search}>Search</button>

      <ul>
        {results.map((wine) => (
          <li key={wine._id}>
            {wine.name} ({wine.grape}) - {wine.rating}
            {savedWineIds.includes(wine._id) ? (
                <span style={{ color: "green" }}> ✔</span>
              ) : (
                <button onClick={() => saveWine(wine._id)}>Save</button>
              )}
          </li>
        ))}
      </ul>
    </div>
  );
}
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import GoogleButton from 'react-google-button';
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  const [wines, setWines] = useState([]);
  const [savedWineIds, setSavedWineIds] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (session) {
      // Fetch all wines
      fetch("/api/wines")
        .then((res) => res.json())
        .then((data) => setWines(data));

      // Fetch user's saved wines
      fetch("/api/users/savedWines")
        .then((res) => res.json())
        .then((data) => setSavedWineIds(data.map((wine) => wine._id)));
    }
  }, [session]);

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
      //alert("Error saving wine");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Wine Reviewer</h1>
      {!session ? (
        <GoogleButton onClick={() => signIn('google')} />
      ) : (
        <div>
          <p>Logged in as {session.user.name}</p>
          <button onClick={() => signOut()}>Sign Out</button>
          <div>
            <h1>Menu</h1>
            <ul>
              <li>
                <Link href="/addWine">Add a Wine</Link>
              </li>
              <li>
                <Link href="/savedWines">View Your Saved Wines</Link>
              </li>
              <li>
                <Link href="/searchWines">Search Wines</Link>
              </li>
              <li>
                <Link href="/topWines">View Top Rated Wines</Link>
              </li>
            </ul>
          </div>
          <h2>Recently added</h2>
          {wines.map((wine) => (
            <div key={wine._id} style={{ marginBottom: "10px", padding: "0 20px" }}>
              <strong>{wine.display_name}</strong> - {wine.wine} - {wine.region} ({wine.rating})
              <button onClick={() => router.push(`/wines/${wine._id}`)} style={{ marginLeft: "10px" }}>
                View Details
              </button>
              {savedWineIds.includes(wine._id) ? (
                <span style={{ color: "green" }}> ✔</span>
              ) : (
                <button onClick={() => saveWine(wine._id)}>Save</button>
              )}
              <button onClick={() => router.push(`/addReview?wineId=${wine._id}`)}>
                Add Review
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

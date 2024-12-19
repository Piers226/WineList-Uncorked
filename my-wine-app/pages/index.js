// pages/index.js
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [wines, setWines] = useState([]);

  useEffect(() => {
    fetch("/api/wines")
      .then(res => res.json())
      .then(data => setWines(data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Wine Reviewer</h1>
      {!session ? (
        <button onClick={() => signIn("google")}>Log In w/ Google</button>
      ) : (
        <div>
          <p>Logged in as {session.user.email}</p>
          <button onClick={() => signOut()}>Sign Out</button>
          <a href="/add-wine">Add a Wine</a>
        </div>
      )}

      <h2>Wines</h2>
      {wines.map((wine) => (
        <div key={wine._id}>
          <strong>{wine.name}</strong> - {wine.notes} ({wine.rating})
        </div>
      ))}
    </div>
  );
}
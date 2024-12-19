import { useSession, signIn, signOut } from "next-auth/react";
import GoogleButton from 'react-google-button';
import { useEffect, useState } from 'react';

export default function Home() {
  const { data: session } = useSession();
  const [wines, setWines] = useState([]);

  useEffect(() => {
    if (session) {
      fetch('/api/wines')
        .then(res => res.json())
        .then(data => setWines(data));
    }
  }, [session]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Wine Reviewer</h1>
      {!session ? (
        <GoogleButton onClick={() => signIn('google')} />
      ) : (
        <div>
            <p>Logged in as {session.user.name}</p>
            <button onClick={() => signOut()}>Sign Out</button>
            <a href="/addWine">Add a Wine</a>

          <h2>Wines</h2>
          {wines.map((wine) => (
            <div key={wine._id}>
              <strong>{wine.name}</strong> - <em>{wine.grape}</em> - {wine.notes} ({wine.rating}) - <em>{wine.username}</em>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AddWine() {
  const { data: session } = useSession();
  const router = useRouter();
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState('');

  if (!session) {
    return <p>You must be logged in to add a wine. <a href="/">Back Home</a></p>;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch('/api/wines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, notes, rating: parseInt(rating) })
    });
    if (res.ok) {
      router.push('/');
    } else {
      alert('Error adding wine');
    }
  }

  return (
    <div style={{ padding:20 }}>
      <h1>Add a Wine</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label>Notes:</label>
          <input value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
        <div>
          <label>Rating (0-100):</label>
          <input type="number" value={rating} onChange={e => setRating(e.target.value)} />
        </div>
        <button type="submit">Add Wine</button>
      </form>
    </div>
  );
}
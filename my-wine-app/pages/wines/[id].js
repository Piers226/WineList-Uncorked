import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function WineDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [wine, setWine] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    // Fetch wine details and reviews
    async function fetchWineDetails() {
      try {
        const res = await fetch(`/api/wines/${id}`);
        if (res.ok) {
          const data = await res.json();
          setWine(data.wine);
          setReviews(data.reviews);
        } else {
          const errorData = await res.json();
          setError(errorData.error || "Failed to fetch wine details");
        }
      } catch (error) {
        setError("An unexpected error occurred.");
      }
    }

    fetchWineDetails();
  }, [id]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!wine) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{wine.display_name}</h1>
      <p><strong>Producer:</strong> {wine.producer_name}</p>
      <p><strong>Wine:</strong> {wine.wine}</p>
      <p><strong>Country:</strong> {wine.country}</p>
      <p><strong>Region:</strong> {wine.region}</p>
      <p><strong>Sub-Region:</strong> {wine.sub_region}</p>
      <p><strong>Color:</strong> {wine.color}</p>
      <p><strong>Type:</strong> {wine.type}</p>
      <p><strong>Rating:</strong> {wine.rating}</p>
      <p><strong>Notes:</strong> {wine.general_notes}</p>

      <h2>Reviews</h2>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review._id} style={{ marginBottom: "10px" }}>
            <p><strong>{review.username}:</strong> {review.notes}</p>
            <p><strong>Rating:</strong> {review.rating}/10</p>
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  );
}
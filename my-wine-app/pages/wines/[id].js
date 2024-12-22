import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";

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

  if (error)
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );

  if (!wine)
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );

  return (
    <Container sx={{ mt: 4 }}>
      {/* Wine Details */}
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {wine.display_name}
          </Typography>
          <Typography variant="body1">
            <strong>Producer:</strong> {wine.producer_name || "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>Wine:</strong> {wine.wine || "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>Country:</strong> {wine.country || "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>Region:</strong> {wine.region || "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>Sub-Region:</strong> {wine.sub_region || "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>Color:</strong> {wine.color || "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>Type:</strong> {wine.type || "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>Rating:</strong> {wine.rating ? `${wine.rating}/10` : "N/A"}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Notes:</strong> {wine.general_notes || "No notes provided."}
          </Typography>
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Reviews
        </Typography>
        {reviews.length > 0 ? (
          <Grid container spacing={2}>
            {reviews.map((review) => (
              <Grid item xs={12} key={review._id}>
                <Card>
                  <CardContent>
                    <Typography variant="body1">
                      <strong>{review.username}:</strong> {review.notes}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Rating: {review.rating}/10
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No reviews yet.</Typography>
        )}
      </Box>
    </Container>
  );
}
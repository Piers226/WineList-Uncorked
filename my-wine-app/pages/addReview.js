import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
} from "@mui/material";

export default function AddReview() {
  const { data: session } = useSession();
  const router = useRouter();
  const { wineId } = router.query;

  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState("");

  if (!session) {
    return (
      <Container style={{ marginTop: "20px" }}>
        <Typography variant="h5" align="center">
          You must be logged in to add a review.{" "}
          <Button onClick={() => router.push("/")} variant="contained" color="primary">
            Back Home
          </Button>
        </Typography>
      </Container>
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
    <Container style={{ marginTop: "20px" }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Add a Review
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                label="Notes"
                variant="outlined"
                fullWidth
                multiline
                minRows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Rating (0-10)"
                variant="outlined"
                type="number"
                fullWidth
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                inputProps={{
                  min: 0,
                  max: 10,
                  step: 0.1,
                }}
              />
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Button variant="contained" color="primary" type="submit">
                Add Review
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
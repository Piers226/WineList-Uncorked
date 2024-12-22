import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Grid,
} from "@mui/material";

export default function SavedWines() {
  const [savedWines, setSavedWines] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchSavedWines();
  }, []);

  async function fetchSavedWines() {
    const res = await fetch("/api/users/savedWines");
    if (res.ok) {
      const data = await res.json();
      setSavedWines(data);
    } else {
      alert("Error fetching saved wines");
    }
  }

  async function removeWine(wineId) {
    const res = await fetch("/api/users/savedWines", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wineId }),
    });
    if (res.ok) {
      setSavedWines(savedWines.filter((wine) => wine._id !== wineId));
    } else {
      alert("Error removing wine");
    }
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Saved Wines
      </Typography>
      {savedWines.length > 0 ? (
        <Grid container spacing={2}>
          {savedWines.map((wine) => (
            <Grid item xs={12} md={6} lg={4} key={wine._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{wine.display_name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Wine:</strong> {wine.wine || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Region:</strong> {wine.region || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Rating:</strong> {wine.rating ? `${wine.rating}/10` : "N/A"}
                  </Typography>
                  <Box mt={2} display="flex" justifyContent="space-between">
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => removeWine(wine._id)}
                    >
                      Remove
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => router.push(`/addReview?wineId=${wine._id}`)}
                    >
                      Add Review
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="textSecondary">
          No saved wines found.
        </Typography>
      )}
    </Container>
  );
}
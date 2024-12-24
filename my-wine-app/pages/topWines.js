import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
} from "@mui/material";

export default function TopWines() {
  const [wines, setWines] = useState([]);
  const [savedWineIds, setSavedWineIds] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch top-rated wines
    async function fetchTopWines() {
      const res = await fetch("/api/wines/top");
      if (res.ok) {
        const data = await res.json();
        setWines(data);
      }
    }

    // Fetch user's saved wines
    async function fetchSavedWines() {
      const res = await fetch("/api/users/savedWines");
      if (res.ok) {
        const data = await res.json();
        setSavedWineIds(data.map((wine) => wine._id));
      }
    }

    fetchTopWines();
    fetchSavedWines();
  }, []);

  async function saveWine(wineId) {
    const res = await fetch("/api/users/saveWine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wineId }),
    });
    if (res.ok) {
      setSavedWineIds([...savedWineIds, wineId]);
    } else {
      alert("Error saving wine");
    }
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Top Rated Wines
      </Typography>
      {wines.length > 0 ? (
        <Grid container spacing={2}>
          {wines.map((wine) => (
            <Grid item xs={12} sm={6} md={4} key={wine._id}>
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
                    <strong>Rating:</strong>{" "}
                    {wine.rating ? `${wine.rating}/10` : "N/A"}
                  </Typography>
                  <Box mt={2} display="flex" justifyContent="space-between">
                  <Button
                          variant="outlined"
                          size="small"
                          onClick={() => router.push(`/wines/${wine._id}`)}
                          sx={{ mr: 1 }}
                        >
                          View Details
                        </Button>
                    {savedWineIds.includes(wine._id) ? (
                      <Button variant="outlined" disabled>
                        Saved ✔
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => saveWine(wine._id)}
                      >
                        Save
                      </Button>
                    )}
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
          No top-rated wines found.
        </Typography>
      )}
    </Container>
  );
}
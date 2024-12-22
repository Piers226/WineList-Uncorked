import { useState } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
} from "@mui/material";

export default function SearchWines() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [savedWineIds, setSavedWineIds] = useState([]);
  const router = useRouter();

  async function search() {
    const res = await fetch(`/api/wines/search?query=${query}`);
    const data = await res.json();
    setResults(data);

    // Fetch user's saved wines
    const savedRes = await fetch("/api/users/savedWines");
    const savedData = await savedRes.json();
    setSavedWineIds(savedData.map((wine) => wine._id));
  }

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
        Search Wines
      </Typography>
      <Box display="flex" gap={2} mb={3}>
        <TextField
          fullWidth
          label="Search by Display Name, Wine, or Producer"
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={search}>
          Search
        </Button>
      </Box>

      {results.length > 0 ? (
        <Grid container spacing={2}>
          {results.map((wine) => (
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
          No results found. Try a different search query.
        </Typography>
      )}
    </Container>
  );
}
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
  Pagination,
} from "@mui/material";

export default function SearchWines() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [savedWineIds, setSavedWineIds] = useState([]);
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const router = useRouter();
  const limit = 10; // Number of results per page

  async function fetchSearchResults(pageNumber = 1) {
    const res = await fetch(`/api/wines/search?query=${query}&page=${pageNumber}&limit=${limit}`);
    const data = await res.json();
    setResults(data.wines); // Assuming the backend sends `wines` and `totalPages`
    setTotalPages(data.totalPages);

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

  function handlePageChange(event, value) {
    setPage(value);
    fetchSearchResults(value);
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
        <Button
          variant="contained"
          color="primary"
          onClick={() => fetchSearchResults(1)} // Reset to page 1 on new search
        >
          Search
        </Button>
      </Box>

      {results.length > 0 ? (
        <>
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
                      <strong>Rating:</strong> {wine.rating ? `${wine.rating}/10` : "N/A"}
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

          <Box mt={4} display="flex" justifyContent="center">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      ) : (
        <Typography variant="body1" color="textSecondary">
          No results found. Try a different search query.
        </Typography>
      )}
    </Container>
  );
}
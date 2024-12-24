import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Container, Typography, Grid, Box, List, ListItem, ListItemText, Button } from "@mui/material";

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

  // Group wines by color
  const groupedWines = savedWines.reduce((groups, wine) => {
    const color = wine.color || "Unknown";
    if (!groups[color]) groups[color] = [];
    groups[color].push(wine);
    return groups;
  }, {});

  return (
    <Container maxWidth={false} sx={{ mt: 4, px: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Wine List
      </Typography>
      <Grid container spacing={4}>
        {Object.keys(groupedWines).length > 0 ? (
          Object.keys(groupedWines).map((color) => (
            <Grid item xs={12} md={6} lg={3} key={color}>
              <Box>
                <Typography variant="h5" gutterBottom>
                  {color} Wines
                </Typography>
                <List>
                  {groupedWines[color].map((wine, index) => (
                    <ListItem key={wine._id} divider>
                      <ListItemText
                        primary={`${index + 1}. ${wine.display_name}`}
                        secondary={
                          <>
                            <span><strong>Wine:</strong> {wine.wine || "N/A"}</span>
                            <br />
                            <span><strong>Region:</strong> {wine.region || "N/A"}</span>
                            <br />
                            <span><strong>Rating:</strong> {wine.rating ? `${wine.rating}/10` : "N/A"}</span>
                          </>
                        }
                      />
                      <Box>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => router.push(`/wines/${wine._id}`)}
                        >
                          View
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          onClick={() => removeWine(wine._id)}
                        >
                          Remove
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          color="secondary"
                          sx={{ mr: 1 }}
                          onClick={() => router.push(`/addReview?wineId=${wine._id}`)}
                        >
                          Review
                        </Button>     
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No saved wines found.
          </Typography>
        )}
      </Grid>
    </Container>
  );
}
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Box,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddCommentIcon from "@mui/icons-material/AddComment";

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
        <List>
          {savedWines.map((wine, index) => (
            <ListItem
              key={wine._id}
              divider
              sx={{
                padding: "16px",
                backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
              }}
            >
              <Box sx={{ mr: 2, fontWeight: "bold", fontSize: "1.25rem" }}>
                {index + 1}.
              </Box>
              <ListItemText
                primary={wine.display_name}
                secondary={`Wine: ${wine.wine || "N/A"} | Region: ${
                  wine.region || "N/A"
                } | Rating: ${wine.rating ? `${wine.rating}/10` : "N/A"}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  color="primary"
                  onClick={() => router.push(`/wines/${wine._id}`)}
                  sx={{ mr: 1 }}
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  color="secondary"
                  onClick={() => router.push(`/addReview?wineId=${wine._id}`)}
                  sx={{ mr: 1 }}
                >
                  <AddCommentIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  color="error"
                  onClick={() => removeWine(wine._id)}
                >
                  <DeleteForeverIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1" color="textSecondary">
          No saved wines found.
        </Typography>
      )}
    </Container>
  );
}
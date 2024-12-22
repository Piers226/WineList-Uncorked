import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  FormControl,
  InputLabel,
  Card,
  CardContent,
} from "@mui/material";

export default function AddWine() {
  const { data: session } = useSession();
  const router = useRouter();

  const [display_name, setDisplayName] = useState("");
  const [producer_name, setProducerName] = useState("");
  const [wine, setWine] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [sub_region, setSubRegion] = useState("");
  const [color, setColor] = useState("");
  const [type, setType] = useState("");
  const [general_notes, setGeneralNotes] = useState("");
  const [rating, setRating] = useState("");

  const colors = ["Red", "White", "Rosé", "Sparkling"];
  const types = ["Still", "Sparkling", "Dessert", "Fortified"];

  if (!session) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" align="center">
          You must be logged in to add a wine.{" "}
          <Button onClick={() => router.push("/")} variant="contained" color="primary">
            Back Home
          </Button>
        </Typography>
      </Container>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!display_name || !producer_name || !rating) {
      alert("Display Name, Producer Name, and Rating are required!");
      return;
    }

    const parsedRating = parseFloat(rating).toFixed(2);

    if (parsedRating < 0 || parsedRating > 10) {
      alert("Rating must be between 0 and 10.");
      return;
    }

    const newWine = {
      display_name,
      producer_name,
      wine,
      country,
      region,
      sub_region,
      color,
      type,
      general_notes,
      rating: Number(parsedRating),
    };

    const res = await fetch("/api/wines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newWine),
    });

    if (res.ok) {
      router.push("/");
    } else {
      const errorData = await res.json();
      alert(errorData.error || "An unknown error occurred");
    }
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Add a Wine
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                label="Display Name"
                variant="outlined"
                fullWidth
                value={display_name}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Producer Name"
                variant="outlined"
                fullWidth
                value={producer_name}
                onChange={(e) => setProducerName(e.target.value)}
                required
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Wine"
                variant="outlined"
                fullWidth
                value={wine}
                onChange={(e) => setWine(e.target.value)}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Country"
                variant="outlined"
                fullWidth
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Region"
                variant="outlined"
                fullWidth
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Sub-Region"
                variant="outlined"
                fullWidth
                value={sub_region}
                onChange={(e) => setSubRegion(e.target.value)}
              />
            </Box>
            <Box mb={2}>
              <FormControl fullWidth>
                <InputLabel>Color</InputLabel>
                <Select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                >
                  {colors.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box mb={2}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  {types.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box mb={2}>
              <TextField
                label="General Notes"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={general_notes}
                onChange={(e) => setGeneralNotes(e.target.value)}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Rating (0-10)"
                variant="outlined"
                fullWidth
                type="number"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                inputProps={{
                  min: 0,
                  max: 10,
                  step: 0.1,
                }}
                required
              />
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Button variant="contained" color="primary" type="submit">
                Add Wine
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => router.push("/")}
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
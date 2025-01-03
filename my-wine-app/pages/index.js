import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Container, Typography, Card, CardContent, Grid, AppBar, Toolbar, Box } from "@mui/material";


export default function Home() {
  const { data: session } = useSession();
  const [wines, setWines] = useState([]);
  const [savedWineIds, setSavedWineIds] = useState([]);
  const router = useRouter();

  useEffect(() => {
    
    if (session) {
      // Fetch all wines
      fetch("/api/wines")
        .then((res) => res.json())
        .then((data) => setWines(data));

      // Fetch user's saved wines
      fetch("/api/users/savedWines")
        .then((res) => res.json())
        .then((data) => setSavedWineIds(data.map((wine) => wine._id)));
    }
  }, [session]);

  async function saveWine(wineId) {
    const res = await fetch("/api/users/saveWine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wineId }),
    });
    if (res.ok) {
      setSavedWineIds([...savedWineIds, wineId]);
    }
  }

  return (
    <Box>
      {/* Navigation Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Uncorked
          </Typography>
          {!session ? (
            <Button color="inherit" onClick={() => signIn("google")}>
              Sign In
            </Button>
          ) : (
            <Button color="inherit" onClick={() => signOut()}>
              Sign Out
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ mt: 4 }}>
        {!session ? (
          <Box textAlign="center">
          <Typography variant="h2" gutterBottom>
            Welcome to Uncorked
          </Typography>
          <Typography variant="h5" color="textSecondary" gutterBottom>
            Discover, Review, and Save Your Favorite Wines.
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
            Uncorked is your personal wine companion. Explore top-rated wines, share your reviews, and build your own wine list. Sign in to get started!
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => signIn("google")}
            sx={{ mb: 4 }}
          >
            Sign In with Google
          </Button>

          {/* Highlights Section */}
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Explore Wines
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Browse an extensive library of wines and find your next favorite bottle.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Save Your List
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Keep track of wines you love and build your personal wine collection.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Share Reviews
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Rate and review wines to help others discover great options.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              Welcome, {session.user.name}!
            </Typography>

            {/* Menu */}
            <Typography variant="h5" gutterBottom>
              Menu
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item>
                <Button variant="contained" color="secondary" onClick={() => router.push("/addWine")}>
                  Add a Wine
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="secondary" onClick={() => router.push("/savedWines")}>
                  View Your Wine List
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="secondary" onClick={() => router.push("/searchWines")}>
                  Search Wines
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="secondary" onClick={() => router.push("/topWines")}>
                  View Top Rated Wines
                </Button>
              </Grid>
            </Grid>

            {/* Recently Added Wines */}
            <Typography variant="h5" gutterBottom>
              Recently Added Wines
            </Typography>
            <Grid container spacing={3}>
              {wines.map((wine) => (
                <Grid item xs={12} sm={6} md={4} key={wine._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {wine.display_name}
                      </Typography>
                      <Typography color="textSecondary">{wine.wine}</Typography>
                      <Typography variant="body2">Region: {wine.region || "Unknown"}</Typography>
                      <Typography variant="body2" gutterBottom>
                        Rating: {wine.rating || "N/A"}
                      </Typography>
                      <Box mt={2}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => router.push(`/wines/${wine._id}`)}
                          sx={{ mr: 1 }}
                        >
                          View
                        </Button>
                        {savedWineIds.includes(wine._id) ? (
                          <Button variant="contained" size="small" disabled>
                             ✔
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => saveWine(wine._id)}
                            sx={{ mr: 1 }}
                          >
                            Save
                          </Button>
                        )}
                        <Button
                          variant="contained"
                          size="small"
                          color="secondary"
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
          </>
        )}
      </Container>
    </Box>
  );
}
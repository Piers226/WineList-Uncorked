import { SessionProvider } from "next-auth/react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: { main: "#B09C94" },
    secondary: { main: "#1E463F" },
    background: {
      default: "#f9f9f9", // Default page background color
      paper: "#ffffff",   // Background color for cards, modals, etc.
    },
    text: {
      primary: "#333333", // Default text color
      secondary: "#555555", // Secondary text color
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    button: {
      textTransform: "none", // Prevent uppercase button text
    },
  },
  spacing: 8, // Base spacing unit
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px", // Rounded corners for all buttons
          padding: "8px 16px",
        },
        containedPrimary: {
          backgroundColor: "##B09C94",
          "&:hover": {
            backgroundColor: "#704F42",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          padding: "16px",
          margin: "16px 0",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Add shadow to cards
        },
      },
    },
  },
});

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
}
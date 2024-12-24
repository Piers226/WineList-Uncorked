import { SessionProvider, useSession } from "next-auth/react";
import { CssBaseline, ThemeProvider, createTheme, Typography, Button } from "@mui/material";
import Head from "next/head";
import AutoSignOut from "../lib/AutoSignOut.js";


// Define the custom theme
const theme = createTheme({
  palette: {
    primary: { main: "#B09C94" },
    secondary: { main: "#407A71" },
    brown: { main: "#A6593A" },
    background: {
      default: "#f9f9f9",
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#555555",
    },
  },
  typography: {
    fontFamily: "'Playfair Display', serif",
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
      textTransform: "none",
    },
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "8px 16px",
        },
        containedPrimary: {
          backgroundColor: "#B09C94",
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
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
});



export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <SessionProvider session={session}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AutoSignOut />
            <Component {...pageProps} />
        </ThemeProvider>
      </SessionProvider>
    </>
  );
}
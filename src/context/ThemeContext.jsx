import React, { createContext, useState, useMemo } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

export const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState("dark");

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                primary: { main: "#b71c1c" }, // Cinematic red
                secondary: { main: "#0288d1" }, // Blue accent
                background: { default: "#fafafa", paper: "#ffffff" },
                text: { primary: "#212121", secondary: "#757575" },
              }
            : {
                primary: { main: "#ef5350" }, // Vibrant red
                secondary: { main: "#4fc3f7" }, // Neon blue
                background: { default: "#0a0a0a", paper: "#1c2526" }, // Dark cinematic
                text: { primary: "#ffffff", secondary: "#b0bec5" },
              }),
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h4: { fontWeight: 700 }, // Bolder titles
          button: { textTransform: "none" }, // Modern buttons
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                padding: "8px 16px",
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

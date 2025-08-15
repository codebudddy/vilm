import React, { createContext, useState, useMemo } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

// Create Theme Context
export const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState("dark"); // Default to dark for cinematic vibe

  // Toggle theme
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  // Create MUI theme based on mode
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                primary: { main: "#1976d2" }, // Blue for buttons
                background: { default: "#f5f5f5", paper: "#ffffff" },
                text: { primary: "#000000", secondary: "#555555" },
              }
            : {
                primary: { main: "#90caf9" }, // Lighter blue for dark mode
                background: { default: "#121212", paper: "#1e1e1e" }, // Cinematic dark
                text: { primary: "#ffffff", secondary: "#bbbbbb" },
              }),
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Normalizes styles across browsers */}
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

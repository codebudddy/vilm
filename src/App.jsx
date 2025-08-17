import React, { useContext } from "react";
import { ThemeContext, ThemeContextProvider } from "./context/ThemeContext";
import { AuthContext, AuthContextProvider } from "./context/AuthContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Container, Stack, Typography, Button } from "@mui/material";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ScriptRecorder from "./components/Studio";
import Login from "./components/Login";
import Signup from "./components/Signup";

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext);
  if (loading) return <Typography>Loading...</Typography>;
  if (!currentUser) return <Navigate to="/login" />;
  return children;
};

const AppContent = () => {
  const { mode, toggleTheme } = useContext(ThemeContext);
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Header />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route
          path="/studio"
          element={
            <ProtectedRoute>
              <ScriptRecorder />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Container>
  );
};

function App() {
  return (
    <ThemeContextProvider>
      <AuthContextProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthContextProvider>
    </ThemeContextProvider>
  );
}

export default App;

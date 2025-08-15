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
import ScriptRecorder from "./components/ScriptRecorder";
import Login from "./components/Login";
import Signup from "./components/Signup";

console.log("Firebase Config:", {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
});
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
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Typography variant="h4" align="center">
          VILM
        </Typography>
        <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
          <Button variant="outlined" onClick={toggleTheme}>
            Switch to {mode === "light" ? "Dark" : "Light"} Mode
          </Button>
          {currentUser && (
            <Button variant="outlined" onClick={logout}>
              Sign Out
            </Button>
          )}
        </Stack>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ScriptRecorder />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Stack>
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

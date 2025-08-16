import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Box
        sx={{
          p: 3,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
          maxWidth: 400,
          width: "100%",
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h5" align="center">
            Login
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Sign In
            </Button>
          </form>
          <Button variant="outlined" onClick={handleGoogleLogin} fullWidth>
            Sign In with Google
          </Button>
          <Typography align="center">
            Don't have an account?{" "}
            <Button component="a" href="/signup">
              Sign Up
            </Button>
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default Login;

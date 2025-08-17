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
import { db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [error, setError] = useState("");
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!username.trim() || !firstname.trim() || !lastname.trim()) {
      setError("All fields are required");
      return;
    }
    try {
      const userCredential = await signup(email, password);
      const user = userCredential;
      // Update auth profile with username
      await updateProfile(user, { displayName: username });
      // Store additional data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username,
        firstname,
        lastname,
        email,
        createdAt: new Date(),
      });
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
        minHeight: "50vh",
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
          maxWidth: { xs: 300, sm: 400 },
          width: "100%",
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h5" align="center">
            Sign Up
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <form onSubmit={handleSignup}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
              required
              inputProps={{ maxLength: 20 }} // Limit for security
            />
            <TextField
              label="First Name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
              required
              inputProps={{ maxLength: 50 }}
            />
            <TextField
              label="Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
              required
              inputProps={{ maxLength: 50 }}
            />
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
            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Sign Up
            </Button>
          </form>
          <Typography align="center">
            Already have an account?{" "}
            <Button component="a" href="/login">
              Sign In
            </Button>
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default Signup;

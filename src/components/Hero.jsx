import React, { useContext } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Hero = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        textAlign: "center",
        bgcolor: "background.default",
        p: { xs: 2, sm: 4 },
      }}
    >
      <Typography
        variant="h2"
        sx={{ fontWeight: 700, mb: 2, fontSize: { xs: "2rem", sm: "3rem" } }}
      >
        Welcome to Faceless Film Studio
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{ mb: 4, fontSize: { xs: "1rem", sm: "1.25rem" } }}
      >
        Create immersive audio-driven films with AI-powered text-to-speech.
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/studio")}
        >
          Get Started
        </Button>
        {!currentUser && (
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default Hero;

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  Stack,
  Typography,
  Tooltip,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import DownloadIcon from "@mui/icons-material/Download";

const ScriptRecorder = () => {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");

  // Load TTS voices
  useEffect(() => {
    const synth = window.speechSynthesis;
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) setSelectedVoice(availableVoices[0].name);
    };
    synth.onvoiceschanged = loadVoices;
    loadVoices();
    return () => {
      synth.onvoiceschanged = null;
    };
  }, []);

  // Handle TTS
  const handleSpeak = () => {
    if (!text.trim()) return;
    const cleanText = text.replace(/<[^>]*>/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  };

  // Convert text to WAV
  const textToWav = async () => {
    if (!text.trim()) return;
    const cleanText = text.replace(/<[^>]*>/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utterance.voice = voice;

    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const destination = audioContext.createMediaStreamDestination();
    const mediaRecorder = new MediaRecorder(destination.stream);
    const chunks = [];

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tts-output.wav";
      a.click();
      URL.revokeObjectURL(url);
      audioContext.close();
    };

    utterance.onstart = () => mediaRecorder.start();
    utterance.onend = () => mediaRecorder.stop();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: 600,
        mx: "auto",
      }}
    >
      <Stack spacing={3}>
        <Typography variant="h5" align="center" sx={{ fontWeight: 600 }}>
          Script Recorder
        </Typography>
        <TextField
          label="Enter Script"
          multiline
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          fullWidth
          variant="outlined"
          inputProps={{ maxLength: 500 }}
        />
        <Select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          fullWidth
          displayEmpty
          variant="outlined"
        >
          <MenuItem value="" disabled>
            Select Voice
          </MenuItem>
          {voices.map((voice) => (
            <MenuItem key={voice.name} value={voice.name}>
              {voice.name} ({voice.lang})
            </MenuItem>
          ))}
        </Select>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ justifyContent: "center" }}
        >
          <Tooltip title="Play Text-to-Speech">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSpeak}
              disabled={!text.trim()}
              sx={{
                minWidth: 60,
                height: 60,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 0,
              }}
            >
              <PlayArrowIcon fontSize="large" />
            </Button>
          </Tooltip>
          <Tooltip title="Stop Text-to-Speech">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => window.speechSynthesis.cancel()}
              sx={{
                minWidth: 60,
                height: 60,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 0,
              }}
            >
              <StopIcon fontSize="large" />
            </Button>
          </Tooltip>
          <Tooltip title="Download as WAV">
            <Button
              variant="contained"
              color="secondary"
              onClick={textToWav}
              disabled={!text.trim()}
              sx={{
                minWidth: 60,
                height: 60,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 0,
              }}
            >
              <DownloadIcon fontSize="large" />
            </Button>
          </Tooltip>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ScriptRecorder;

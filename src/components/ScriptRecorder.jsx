import React, { useState, useEffect } from "react";
import { Box, TextField, Select, MenuItem, Button, Stack } from "@mui/material";

const ScriptRecorder = () => {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  let mediaRecorder = null;

  // Load voices for TTS
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
      synth.onvoiceschanged = null; // Cleanup
    };
  }, []);

  // Handle TTS
  const handleSpeak = () => {
    if (!text.trim()) return; // Cybersecurity: Prevent empty input
    const cleanText = text.replace(/<[^>]*>/g, ""); // Cybersecurity: Strip HTML
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  };

  // Handle voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); // Cybersecurity: Prompt for mic access
      mediaRecorder = new MediaRecorder(stream);
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop()); // Cleanup
      };
      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Recording error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  return (
    <Box
      sx={{ p: 2, bgcolor: "background.paper", borderRadius: 2, boxShadow: 1 }}
    >
      <Stack spacing={2}>
        {/* TTS Section */}
        <TextField
          label="Enter Script"
          multiline
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          fullWidth
          variant="outlined"
          inputProps={{ maxLength: 500 }} // Cybersecurity: Limit input length
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
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={handleSpeak}
            disabled={!text.trim()}
          >
            Speak
          </Button>
          <Button
            variant="outlined"
            onClick={() => window.speechSynthesis.cancel()}
          >
            Stop
          </Button>
        </Stack>
        {/* Voice Recording Section */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color={recording ? "error" : "primary"}
            onClick={recording ? stopRecording : startRecording}
          >
            {recording ? "Stop Recording" : "Start Recording"}
          </Button>
        </Stack>
        {audioUrl && (
          <audio controls src={audioUrl} style={{ width: "100%" }}>
            Your browser does not support the audio element.
          </audio>
        )}
      </Stack>
    </Box>
  );
};

export default ScriptRecorder;

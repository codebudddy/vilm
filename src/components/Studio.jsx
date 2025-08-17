import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  Stack,
  Typography,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SaveIcon from "@mui/icons-material/Save";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import * as Tone from "tone";

const Studio = () => {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [selectedEffect, setSelectedEffect] = useState("");
  const [stageElements, setStageElements] = useState([]);
  const [openClearDialog, setOpenClearDialog] = useState(false);

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
  const handleSpeak = (cleanText) => {
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
    return utterance;
  };

  // Add element to stage with unique ID
  const addToStage = () => {
    if (!text.trim() && !selectedEffect) return;
    const cleanText = text.replace(/<[^>]*>/g, "").slice(0, 500);
    const newElement = {
      id: Date.now().toString(),
      type: text ? "tts" : "effect",
      text: cleanText,
      effect: selectedEffect,
      voice: selectedVoice,
    };
    setStageElements([...stageElements, newElement]);
    setText("");
    setSelectedEffect("");
  };

  // Remove element from stage
  const removeElement = (id) => {
    setStageElements(stageElements.filter((element) => element.id !== id));
  };

  // Play stage
  const playStage = async () => {
    await Tone.start();
    let time = 0;
    for (const element of stageElements) {
      if (element.type === "tts") {
        const utterance = handleSpeak(element.text);
        await new Promise((resolve) => (utterance.onend = resolve));
      } else if (element.type === "effect") {
        const synth = new Tone.Synth().toDestination();
        synth.triggerAttackRelease("C4", "8n", time);
        time += 0.5;
      }
    }
  };

  // Export stage as audio
  const exportStage = async () => {
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
      a.download = "stage-output.wav";
      a.click();
      URL.revokeObjectURL(url);
      audioContext.close();
    };

    mediaRecorder.start();
    await playStage();
    mediaRecorder.stop();
  };

  // Save stage as JSON
  const saveStage = () => {
    const json = JSON.stringify(stageElements);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stage-config.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import stage from JSON
  const importStage = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedElements = JSON.parse(e.target.result);
        if (
          Array.isArray(importedElements) &&
          importedElements.every(
            (el) => el.id && el.type && (el.text || el.effect)
          )
        ) {
          setStageElements(importedElements);
        } else {
          alert("Invalid stage file format");
        }
      } catch (err) {
        alert("Error reading stage file");
      }
    };
    reader.readAsText(file);
  };

  // Save to localStorage
  const saveToLocal = () => {
    try {
      localStorage.setItem("stageElements", JSON.stringify(stageElements));
      alert("Stage saved to local storage");
    } catch (err) {
      alert("Error saving to local storage");
    }
  };

  // Load from localStorage
  const loadFromLocal = () => {
    try {
      const saved = localStorage.getItem("stageElements");
      if (saved) {
        const importedElements = JSON.parse(saved);
        if (
          Array.isArray(importedElements) &&
          importedElements.every(
            (el) => el.id && el.type && (el.text || el.effect)
          )
        ) {
          setStageElements(importedElements);
        } else {
          alert("Invalid stage data in local storage");
        }
      } else {
        alert("No stage data found in local storage");
      }
    } catch (err) {
      alert("Error loading from local storage");
    }
  };

  // Clear stage with confirmation
  const handleClearStage = () => {
    setOpenClearDialog(true);
  };

  const confirmClearStage = () => {
    setStageElements([]);
    setOpenClearDialog(false);
  };

  const closeClearDialog = () => {
    setOpenClearDialog(false);
  };

  return (
    <Grid
      container
      spacing={1}
      sx={{
        width: "100vw",
        maxHeight: { xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)" },
        margin: 0, // Remove left/right margins to eliminate space
        p: 1,
        overflow: "hidden",
      }}
    >
      <Grid item xs={12} md={6} sx={{ flex: 1 }}>
        <Box
          sx={{
            p: 2,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 3,
            height: "100%",
            width: "100%",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Tools
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="TTS Text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              fullWidth
              inputProps={{ maxLength: 500 }}
              sx={{ "& .MuiInputBase-root": { minHeight: 120 } }}
            />
            <Select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              fullWidth
              displayEmpty
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
            <Select
              value={selectedEffect}
              onChange={(e) => setSelectedEffect(e.target.value)}
              fullWidth
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select Sound Effect
              </MenuItem>
              <MenuItem value="beep">Beep</MenuItem>
              <MenuItem value="hum">Hum</MenuItem>
            </Select>
            <Button
              variant="contained"
              onClick={addToStage}
              disabled={!text && !selectedEffect}
              fullWidth
            >
              Add to Stage
            </Button>
          </Stack>
        </Box>
      </Grid>
      <Grid item xs={12} md={6} sx={{ flex: 1 }}>
        <Box
          sx={{
            p: 2,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 3,
            height: "100%",
            width: "100%",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Stage
          </Typography>
          <Box sx={{ maxHeight: 400, overflowY: "auto", mb: 2 }}>
            <List>
              {stageElements.map((element) => (
                <ListItem
                  key={element.id}
                  divider
                  sx={{ maxWidth: "100%", wordBreak: "break-word" }}
                >
                  <ListItemText
                    primary={
                      element.type === "tts" ? element.text : element.effect
                    }
                    secondary={element.voice || ""}
                  />
                  <IconButton onClick={() => removeElement(element.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Box>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Tooltip title="Play Stage">
              <Button
                variant="contained"
                onClick={playStage}
                disabled={!stageElements.length}
              >
                <PlayArrowIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Export Audio">
              <Button
                variant="contained"
                color="secondary"
                onClick={exportStage}
                disabled={!stageElements.length}
              >
                <DownloadIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Save Stage">
              <Button
                variant="contained"
                color="primary"
                onClick={saveStage}
                disabled={!stageElements.length}
              >
                <SaveIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Import Stage">
              <Button
                variant="contained"
                color="primary"
                component="label"
                disabled={stageElements.length > 0}
              >
                <UploadIcon />
                <input
                  type="file"
                  accept=".json"
                  hidden
                  onChange={importStage}
                />
              </Button>
            </Tooltip>
            <Tooltip title="Save to Local Storage">
              <Button
                variant="outlined"
                color="primary"
                onClick={saveToLocal}
                disabled={!stageElements.length}
              >
                Save to Local
              </Button>
            </Tooltip>
            <Tooltip title="Load from Local Storage">
              <Button
                variant="outlined"
                color="primary"
                onClick={loadFromLocal}
              >
                Load from Local
              </Button>
            </Tooltip>
            <Tooltip title="Clear Stage">
              <Button
                variant="outlined"
                color="error"
                onClick={handleClearStage}
                disabled={!stageElements.length}
              >
                <ClearAllIcon />
              </Button>
            </Tooltip>
          </Stack>
          <Dialog open={openClearDialog} onClose={closeClearDialog}>
            <DialogTitle>Clear Stage</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to clear all elements from the stage? This
                cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeClearDialog}>Cancel</Button>
              <Button onClick={confirmClearStage} color="error">
                Clear
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Studio;

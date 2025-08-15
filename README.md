# Faceless Film Studio

A React app for creating audio-driven films using TTS (Web Speech API), voice recording (MediaRecorder API), and sound effects (Tone.js). Secured with Firebase Authentication (email/password, Google) and features a theme context for dark/light modes.

## Features

- Secure authentication with Firebase (email/password, Google)
- TTS with voice selection (English, French, etc.)
- Voice recording with secure mic access
- Dark/light theme toggle
- Input sanitization (HTML stripping, length limits)

## Tech Stack

- React 18, MUI 7.x.x, Tone.js 15.x.x, Firebase 10.x.x
- Web Speech API, MediaRecorder API
- Secure Firebase configuration using .env and .- gitignore
- Secure Firebase configuration using .env and .gitignore to prevent key exposure.

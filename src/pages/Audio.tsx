// src/pages/Audio.tsx

import { Component } from "solid-js";
import { AudioRoutes } from "../router/audioRoutes";

/**
 * Main Audio Page Component
 */
const AudioPage: Component = () => {
  return (
    <div>
      <h1>Audio Dataset Manager</h1>
      {/* Nested routes for audio can be rendered here */}
      <AudioRoutes />
    </div>
  );
};

export default AudioPage;

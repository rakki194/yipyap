// src/pages/Audio.tsx
//
// Audio Page Component

import { Component } from "solid-js";
import { AudioRoutes } from "../router/audioRoutes";
import FadeIn from "~/components/FadeIn"; // Importing the FadeIn component

/**
 * Main Audio Page Component
 */
const AudioPage: Component = () => {
  return (
    <FadeIn duration={300}>
      <div>
        <h1>Audio Dataset Manager</h1>
        {/* Nested routes for audio can be rendered here */}
        <AudioRoutes />
      </div>
    </FadeIn>
  );
};

export default AudioPage;

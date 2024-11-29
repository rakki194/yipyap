// src/components/Audio/AudioGallery.tsx
//
// Audio Gallery component

import { Component, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import "./AudioGallery.css";

// Mock data for demonstration
const audioFiles = [
  { id: 1, name: "Song One" },
  { id: 2, name: "Song Two" },
  { id: 3, name: "Song Three" },
];

const AudioGallery: Component = () => {
  const navigate = useNavigate();

  const handleAudioClick = (id: number) => {
    navigate(`/audio/${id}`);
  };

  return (
    <div class="audio-gallery">
      <h2>Audio Files</h2>
      <ul>
        <For each={audioFiles}>
          {(audio) => (
            <li onClick={() => handleAudioClick(audio.id)}>{audio.name}</li>
          )}
        </For>
      </ul>
    </div>
  );
};

export default AudioGallery;

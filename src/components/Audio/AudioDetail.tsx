// src/components/Audio/AudioDetail.tsx

import { Component } from "solid-js";
import { useParams } from "@solidjs/router";
import "./AudioDetail.css";

const AudioDetail: Component = () => {
  const params = useParams<{ id: string }>();
  const audioId = params.id;

  // Fetch audio details based on audioId here

  return (
    <div class="audio-detail">
      <h2>Audio Detail for ID: {audioId}</h2>
      {/* Audio player and details go here */}
    </div>
  );
};

export default AudioDetail;

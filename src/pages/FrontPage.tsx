// src/pages/FrontPage.tsx

import { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";
import "./FrontPage.css";
import { DimensionsIcon, SpeakerIcon } from "../components/icons";

const FrontPage: Component = () => {
  const navigate = useNavigate();

  const handleSelection = (type: "image" | "audio") => {
    if (type === "image") {
      navigate("/gallery");
    } else {
      navigate("/audio");
    }
  };

  return (
    <div class="front-page">
      <h1>Welcome to the Dataset Manager</h1>
      <div class="selection-buttons">
        <button
          onClick={() => handleSelection("image")}
          aria-label="Work with Images"
        >
          <div innerHTML={DimensionsIcon} />
        </button>
        {/* <button
          onClick={() => handleSelection("audio")}
          aria-label="Work with Audio"
        >
          <div innerHTML={SpeakerIcon} />
        </button> */}
      </div>
    </div>
  );
};

export default FrontPage;

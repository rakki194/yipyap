// src/pages/FrontPage.tsx

import { Component, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import "./FrontPage.css";
import { DimensionsIcon, SpeakerIcon } from "../components/icons";

const FrontPage: Component = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = createSignal(true);

  const handleSelection = (type: "image" | "audio") => {
    setIsVisible(false); // Trigger the fade-out transition
    setTimeout(() => {
      if (type === "image") {
        navigate("/gallery");
      } else {
        navigate("/audio");
      }
    }, 300); // Duration should match the CSS transition duration
  };

  return (
    <div class={`front-page ${isVisible() ? "visible" : "hidden"}`}>
      <h1 class="title">~yipyap</h1>
      <div class="selection-buttons">
        <button
          onClick={() => handleSelection("image")}
          aria-label="Work with Images"
        >
          <div innerHTML={DimensionsIcon} />
        </button>
        <button
          onClick={() => handleSelection("audio")}
          aria-label="Work with Audio"
        >
          <div innerHTML={SpeakerIcon} />
        </button>
      </div>
    </div>
  );
};

export default FrontPage;

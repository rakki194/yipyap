// src/pages/FrontPage.tsx

import { Component, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { DimensionsIcon, SpeakerIcon, YipYap } from "~/icons";
import "~/styles.css";
import "~/components/FadeIn.css";
import "./FrontPage.css";

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
    <div class={`front-page fade-in ${isVisible() ? "visible" : "hidden"}`}>
      <h1 class="title">
        <span class="icon" innerHTML={YipYap} title="app logo" />
        <br /> ~yipyap
        <br />{" "}
        <span class="subtitle">
          大規模言語モデルは不正行為をし、嘘をつき、幻覚を見ます。まるで私のように！
        </span>
      </h1>
      <div class="selection-buttons">
        <button
          class="icon"
          onClick={() => handleSelection("image")}
          aria-label="Work with Images"
        >
          <div innerHTML={DimensionsIcon} />
        </button>
        <button
          class="icon"
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

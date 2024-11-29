// src/pages/FrontPage.tsx

import { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";
import "./FrontPage.css";

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
        <button onClick={() => handleSelection("image")}>
          Work with Images
        </button>
        <button onClick={() => handleSelection("audio")}>
          Work with Audio
        </button>
      </div>
    </div>
  );
};

export default FrontPage;

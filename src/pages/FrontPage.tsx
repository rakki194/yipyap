// src/pages/FrontPage.tsx

import { Component, createSignal, onMount, onCleanup } from "solid-js";
import { useNavigate } from "@solidjs/router";
import getIcon from "~/icons";
import "~/styles.css";
import "~/components/FadeIn.css";
import "./FrontPage.css";
import { useAppContext } from "~/contexts/app";

const FrontPage: Component = () => {
  const navigate = useNavigate();
  const app = useAppContext();
  const t = app.t;
  const [isVisible, setIsVisible] = createSignal(true);

  onMount(() => {
    document.body.classList.add('on-front-page');
    const title = getAppTitle();
    document.title = title;
    
    onCleanup(() => {
      document.body.classList.remove('on-front-page');
    });
  });

  const getRandomSubtitle = () => {
    if (app.disableNonsense || app.locale === 'ja') {
      return "";
    }
    
    const subtitleKeys = Array.from({ length: 8 }, (_, i) => `frontPage.subtitle.${i + 1}`);
    return t(subtitleKeys[Math.floor(Math.random() * subtitleKeys.length)]);
  };

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

  const getAppTitle = () => {
    if (app.disableNonsense || app.locale === 'ja') {
      return "~yipyap";
    }
    
    const random = Math.random();
    if (random < 0.001) { // 0.1% chance
      return Math.random() < 0.5 ? "yipyap, only in Ohio!" : "skibidi yipyap";
    }
    return "~yipyap";
  };

  return (
    <>
      <div class={`front-page fade-in ${isVisible() ? "visible" : "hidden"}`}>
        <h1 class="title">
          <span class="icon" title="app logo">
            {getIcon("yipyap")}
          </span>
          <br /> {getAppTitle()}
          <br />{" "}
          <span class="subtitle">{getRandomSubtitle()}</span>
        </h1>
        <div class="selection-buttons">
          <button
            type="button"
            class="icon"
            onClick={() => handleSelection("image")}
            aria-label={t('frontPage.imageWork')}
          >
            {getIcon("dimensions")}
          </button>
          <button
            type="button"
            class="icon"
            onClick={() => handleSelection("audio")}
            aria-label={t('frontPage.audioWork')}
          >
            {getIcon("speaker")}
          </button>
        </div>
      </div>
    </>
  );
};

export default FrontPage;

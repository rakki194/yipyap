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
  const [isVisible, setIsVisible] = createSignal(true);

  onMount(() => {
    document.body.classList.add('on-front-page');
    onCleanup(() => {
      document.body.classList.remove('on-front-page');
    });
  });

  const getRandomSubtitle = () => {
    if (app.disableJapanese) {
      return "";
    }
    
    const japaneseSubtitles = [
      "大規模言語モデルは不正行為をし、嘘をつき、幻覚を見ます。まるで私のように！",
      "私たちは別の祈り方を見つけました",
      //"デジタルの残響は沈黙の皮膚を貫通し、不可視の共鳴を囁く",
      "虚ろな瞳に映る、無限の宇宙",
      "錆びた心、新たな芽吹き",
      "夢と現実が交錯する、不思議な境地",
      "未知の領域、無限の可能性",
      "時の流れを超えた、永遠の愛",
      "これで追い出されますよ！",
     ];

    return japaneseSubtitles[Math.floor(Math.random() * japaneseSubtitles.length)];
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

  return (
    <div class={`front-page fade-in ${isVisible() ? "visible" : "hidden"}`}>
      <h1 class="title">
        <span class="icon" title="app logo">
          {getIcon("yipyap")}
        </span>
        <br /> ~yipyap
        <br />{" "}
        <span class="subtitle">{getRandomSubtitle()}</span>
      </h1>
      <div class="selection-buttons">
        <button
          type="button"
          class="icon"
          onClick={() => handleSelection("image")}
          aria-label="Work with Images"
        >
          {getIcon("dimensions")}
        </button>
        <button
          type="button"
          class="icon"
          onClick={() => handleSelection("audio")}
          aria-label="Work with Audio"
        >
          {getIcon("speaker")}
        </button>
      </div>
    </div>
  );
};

export default FrontPage;

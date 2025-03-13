// src/pages/not_found.tsx
//
// Not Found page component

import type { Component } from "solid-js";
import { useParams, A } from "@solidjs/router";
import { useAppContext } from "~/contexts/app";
import FadeIn from "~/components/FadeIn";
import getIcon from "~/icons";
import "./not_found.css";
export const NotFound: Component = () => {
  const params = useParams();
  const app = useAppContext();
  const t = app.t;

  return (
    <FadeIn duration={300}>
      <nav class="breadcrumb">
        <div class="breadcrumb-content">
          <div class="breadcrumb-links">
            <A href="/" aria-label={t('common.home')}>
              <span class="accent-hover icon" title={t('common.home')}>
                {getIcon("yipyap")}
              </span>
            </A>
          </div>
        </div>
      </nav>
      <div class="not-found error-message">
        <h2>{t('errors.notFound')}</h2>
        <p>{t('errors.pageNotFound', { path: params["404"] || "" })}</p>
        <A href="/" class="button">{t('common.returnHome')}</A>
      </div>
    </FadeIn>
  );
};

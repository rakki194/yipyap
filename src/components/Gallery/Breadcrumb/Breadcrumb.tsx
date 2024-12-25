import { Component } from "solid-js";
import { BreadcrumbNavigation } from "./BreadcrumbNavigation";
import { BreadcrumbStats } from "./BreadcrumbStats";
import { BreadcrumbActions } from "./BreadcrumbActions";
import "./Breadcrumb.css";

export const Breadcrumb: Component = () => {
  return (
    <>
      <nav class="breadcrumb">
        <div class="breadcrumb-content">
          <BreadcrumbNavigation />
          <BreadcrumbStats />
          <BreadcrumbActions />
        </div>
      </nav>
    </>
  );
};

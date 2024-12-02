// src/components/Common/Modal.tsx
//
// A generic modal component to encapsulate modal behavior and styling.

import { Component, JSX, Show } from "solid-js";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: JSX.Element;
}

const Modal: Component<ModalProps> = (props) => {
  return (
    <Show when={props.isOpen}>
      <div class="modal-overlay" onClick={props.onClose}>
        <div class="modal-content" onClick={(e) => e.stopPropagation()}>
          {props.title && <h2 class="modal-title">{props.title}</h2>}
          {props.children}
        </div>
      </div>
    </Show>
  );
};

export default Modal;

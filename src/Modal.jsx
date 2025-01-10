import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  return (
    <div
      className={`dfchat-modal-overlay ${isOpen ? "open" : ""}`}
      onClick={onClose}
    >
      <div
        className="dfchat-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;

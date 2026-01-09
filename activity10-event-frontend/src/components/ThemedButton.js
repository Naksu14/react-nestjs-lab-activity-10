import React from "react";

const ThemedButton = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded font-medium uppercase transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] bg-[var(--accent-color)] text-white hover:bg-[var(--accent-color)]/90 active:bg-[var(--accent-color)]/80 shadow ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default ThemedButton;

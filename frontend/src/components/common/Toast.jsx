import React, { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
    warning: "bg-yellow-500 text-black"
  };

  return (
    <div
      className={`fixed top-6 right-6 z-[9999] text-white px-4 py-3 rounded shadow-lg flex items-center gap-3 ${colors[type]}`}
    >
      <span className="text-sm">{message}</span>

      <button
        onClick={onClose}
        className="text-white text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}

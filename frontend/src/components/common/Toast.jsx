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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      <div
        className={`
          ${colors[type]}
          text-white px-6 py-4 rounded-lg shadow-xl
          flex items-center gap-4 text-sm
          animate-fade-in
          pointer-events-auto
        `}
      >
        <span>{message}</span>

        <button
          onClick={onClose}
          className="text-white text-lg leading-none hover:opacity-80"
        >
          ×
        </button>
      </div>
    </div>
  );
}

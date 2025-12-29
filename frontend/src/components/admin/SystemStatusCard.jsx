import React from "react";

export default function SystemStatusCard({
  title,
  value,
  subtitle,
  status = "normal" // normal | warning | danger
}) {
  const statusColor =
    status === "danger"
      ? "border-red-500"
      : status === "warning"
      ? "border-yellow-500"
      : "border-green-500";

  return (
    <div
      className={`bg-white p-5 rounded-lg shadow border-l-4 ${statusColor}`}
    >
      <h3 className="text-sm text-gray-500">{title}</h3>

      <p className="text-2xl font-bold text-gray-800 mt-1">
        {value}
      </p>

      {subtitle && (
        <p className="text-xs text-gray-400 mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
}

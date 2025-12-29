import React, { useEffect, useState } from "react";

// 🔒 Frontend image cache (persists across day switching)
const imageCache = new Map();

export default function FoodItem({ food }) {
  if (!food.image) {
    return (
      <div className="p-4">
        <div className="w-full h-40 bg-gray-200 rounded mb-3" />
        <p className="font-semibold">{food.item}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <img
        src={food.image}
        alt={food.item}
        className="w-full h-40 object-cover rounded mb-3"
      />

      <p className="font-semibold">{food.item}</p>

      <div className="grid grid-cols-2 text-sm text-gray-600 mt-2">
        <span>🔥 {food.calories} kcal</span>
        <span>🥩 {food.protein}g protein</span>
        <span>🍚 {food.carbs}g carbs</span>
        <span>🥑 {food.fats}g fats</span>
      </div>
    </div>
  );
}


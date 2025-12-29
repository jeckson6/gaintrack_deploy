import React from "react";
import FoodItem from "./FoodItem";

export default function FoodPlanCard({ meal }) {
  if (!meal || !Array.isArray(meal.foods)) return null;

  return (
    <div className="bg-white rounded-xl shadow">
      <div className="p-4 font-semibold border-b">
        {meal.name}
      </div>

      {meal.foods.map((food, i) => (
        <FoodItem key={i} food={food} />
      ))}
    </div>
  );
}

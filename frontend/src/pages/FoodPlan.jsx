import React, { useEffect, useState } from "react";

export default function FoodPlan() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [plans, setPlans] = useState([]);

  const [form, setForm] = useState({
    dailyCalories: "",
    protein: "",
    carbs: "",
    fats: "",
    mealPlan: ""
  });

  const fetchPlans = async () => {
    const res = await fetch(
      `http://localhost:5000/api/food-plan?userId=${user.UserID}`
    );
    setPlans(await res.json());
  };

  useEffect(() => {
    if (user) fetchPlans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/api/food-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.UserID,
        ...form
      })
    });

    fetchPlans();
    setForm({
      dailyCalories: "",
      protein: "",
      carbs: "",
      fats: "",
      mealPlan: ""
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Food Plans</h1>

      {/* LIST */}
      <div className="space-y-4 mb-6">
        {plans.map(plan => (
          <div key={plan.FoodPlanID} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between mb-2">
              <h2 className="font-semibold text-lg">
                {plan.DailyCalories} kcal / day
              </h2>
              <span className="text-sm text-gray-500">
                {new Date(plan.CreatedAt).toISOString().split("T")[0]}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm mb-3">
              <div>🥩 Protein: {plan.Protein_g} g</div>
              <div>🍚 Carbs: {plan.Carbs_g} g</div>
              <div>🥑 Fats: {plan.Fats_g} g</div>
            </div>

            <pre className="bg-gray-50 p-3 rounded text-sm">
              {plan.MealPlan}
            </pre>
          </div>
        ))}
      </div>

      {/* ADD PLAN */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="font-semibold mb-3">Add Food Plan</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Daily Calories"
            className="border p-2"
            value={form.dailyCalories}
            onChange={e =>
              setForm({ ...form, dailyCalories: e.target.value })
            }
            required
          />

          <input
            type="number"
            placeholder="Protein (g)"
            className="border p-2"
            value={form.protein}
            onChange={e => setForm({ ...form, protein: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Carbs (g)"
            className="border p-2"
            value={form.carbs}
            onChange={e => setForm({ ...form, carbs: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Fats (g)"
            className="border p-2"
            value={form.fats}
            onChange={e => setForm({ ...form, fats: e.target.value })}
            required
          />

          <textarea
            className="border p-2 col-span-2"
            rows="4"
            placeholder="Meal Plan (Breakfast, Lunch, Dinner...)"
            value={form.mealPlan}
            onChange={e => setForm({ ...form, mealPlan: e.target.value })}
            required
          />

          <button className="col-span-2 bg-green-600 text-white py-2 rounded">
            Save Food Plan
          </button>
        </form>
      </div>
    </div>
  );
}

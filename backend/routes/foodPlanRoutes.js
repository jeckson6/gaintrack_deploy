const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ Latest food plan
router.get("/latest", async (req, res) => {
  const { userId } = req.query;

  const [[plan]] = await db.promise().query(
    `
    SELECT *
    FROM AIFoodPlan
    WHERE UserID = ?
    ORDER BY CreatedAt DESC
    LIMIT 1
    `,
    [userId]
  );

  if (!plan) return res.json(null);

  res.json({
    macros: {
      protein: plan.Protein_g,
      carbs: plan.Carbs_g,
      fats: plan.Fats_g
    },
    weeklyMeals: JSON.parse(plan.MealPlan),
    createdAt: plan.CreatedAt
  });
});

// ✅ Food plan history
router.get("/history", async (req, res) => {
  const { userId } = req.query;

  const [rows] = await db.promise().query(
    `
    SELECT FoodPlanID, CreatedAt
    FROM AIFoodPlan
    WHERE UserID = ?
    ORDER BY CreatedAt DESC
    `,
    [userId]
  );

  res.json(rows);
});

module.exports = router;

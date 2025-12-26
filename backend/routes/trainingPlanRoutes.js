const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ Latest training plan
router.get("/latest", async (req, res) => {
  const { userId } = req.query;

  const [[plan]] = await db.promise().query(
    `
    SELECT *
    FROM AITrainingPlan
    WHERE UserID = ?
    ORDER BY CreatedAt DESC
    LIMIT 1
    `,
    [userId]
  );

  if (!plan) return res.json(null);

  res.json({
    planType: plan.PlanType,
    trainingMethod: plan.TrainingMethod,
    trainingPlan: JSON.parse(plan.WeeklySchedule),
    createdAt: plan.CreatedAt
  });
});

// ✅ Training plan history
router.get("/history", async (req, res) => {
  const { userId } = req.query;

  const [rows] = await db.promise().query(
    `
    SELECT PlanID, PlanType, TrainingMethod, CreatedAt
    FROM AITrainingPlan
    WHERE UserID = ?
    ORDER BY CreatedAt DESC
    `,
    [userId]
  );

  res.json(rows);
});

module.exports = router;

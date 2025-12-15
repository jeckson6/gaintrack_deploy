const db = require("../config/db");

exports.getFoodPlansByUser = (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "UserID required" });
  }

  const sql = `
    SELECT * FROM AIFoodPlan
    WHERE UserID = ?
    ORDER BY CreatedAt DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    res.json(results);
  });
};

exports.createFoodPlan = (req, res) => {
  const {
    userId,
    dailyCalories,
    protein,
    carbs,
    fats,
    mealPlan
  } = req.body;

  const sql = `
    INSERT INTO AIFoodPlan
    (UserID, DailyCalories, Protein_g, Carbs_g, Fats_g, MealPlan, CreatedAt)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(
    sql,
    [userId, dailyCalories, protein, carbs, fats, mealPlan],
    (err) => {
      if (err) return res.status(500).json({ message: "Insert failed" });
      res.json({ message: "Food plan created" });
    }
  );
};

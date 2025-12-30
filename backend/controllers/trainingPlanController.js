//Get Active Training Plan
exports.getActiveTrainingPlan = async (req, res) => {
  try {
    const userId = req.user.id;

    const [[plan]] = await db.promise().query(
      `
      SELECT
        plan_id,
        plan_type,
        training_method,
        weekly_schedule,
        created_at
      FROM ai_training_plan
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [userId]
    );

    res.json(plan || null);
  } catch (err) {
    console.error("GET ACTIVE TRAINING PLAN ERROR:", err);
    res.status(500).json({ message: "Failed to load active training plan" });
  }
};

//Get Training Plan History
exports.getTrainingPlanHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const [plans] = await db.promise().query(
      `
      SELECT
        plan_id,
        plan_type,
        training_method,
        created_at
      FROM ai_training_plan
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json(plans);
  } catch (err) {
    console.error("GET TRAINING HISTORY ERROR:", err);
    res.status(500).json({ message: "Failed to load training history" });
  }
};

// Restore (Clone) Old Training Plan
exports.activateTrainingPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { planId } = req.params;

    // 1️⃣ Load old plan
    const [[oldPlan]] = await db.promise().query(
      `
      SELECT
        plan_type,
        training_method,
        weekly_schedule
      FROM ai_training_plan
      WHERE plan_id = ? AND user_id = ?
      `,
      [planId, userId]
    );

    if (!oldPlan) {
      return res.status(404).json({ message: "Training plan not found" });
    }

    // 2️⃣ Insert as NEW active plan
    await db.promise().query(
      `
      INSERT INTO ai_training_plan
      (user_id, plan_type, training_method, weekly_schedule, created_at)
      VALUES (?, ?, ?, ?, NOW())
      `,
      [
        userId,
        oldPlan.plan_type,
        oldPlan.training_method,
        oldPlan.weekly_schedule
      ]
    );

    res.json({ message: "Training plan restored successfully" });

  } catch (err) {
    console.error("RESTORE TRAINING PLAN ERROR:", err);
    res.status(500).json({ message: "Failed to restore training plan" });
  }
};


//Get Active Training Plan
exports.getActiveTrainingPlan = async (req, res) => {
  const userId = req.user.id;

  const [rows] = await db.promise().query(
    `SELECT * FROM AITrainingPlan 
     WHERE UserID = ? AND IsActive = TRUE
     LIMIT 1`,
    [userId]
  );

  res.json(rows[0] || null);
};

//Get Training Plan History
exports.getTrainingPlanHistory = async (req, res) => {
  const userId = req.user.id;

  const [rows] = await db.promise().query(
    `SELECT PlanID, PlanType, TrainingMethod, TrainingDays, IsActive, CreatedAt
     FROM AITrainingPlan
     WHERE UserID = ?
     ORDER BY CreatedAt DESC`,
    [userId]
  );

  res.json(rows);
};

//Activate (Restore) Old Plan
exports.activateTrainingPlan = async (req, res) => {
  const userId = req.user.id;
  const { planId } = req.params;

  const conn = await db.promise().getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      `UPDATE AITrainingPlan SET IsActive = FALSE WHERE UserID = ?`,
      [userId]
    );

    const [result] = await conn.query(
      `UPDATE AITrainingPlan 
       SET IsActive = TRUE 
       WHERE PlanID = ? AND UserID = ?`,
      [planId, userId]
    );

    if (result.affectedRows === 0) {
      throw new Error("Plan not found");
    }

    await conn.commit();
    res.json({ message: "Training plan activated" });

  } catch (err) {
    await conn.rollback();
    res.status(400).json({ error: err.message });
  } finally {
    conn.release();
  }
};

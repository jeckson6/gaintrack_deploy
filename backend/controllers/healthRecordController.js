const db = require("../config/db");

// CREATE
exports.createRecord = async (req, res) => {
  try {
    const {
      userId,
      height,
      weight,
      bmi,
      bodyFat,
      recordedDate
    } = req.body;

    if (!userId || !weight || !bmi || !recordedDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user already has health records
    const [[existing]] = await db.promise().query(
      `SELECT height_cm
      FROM health_record
      WHERE user_id = ?
      ORDER BY recorded_date ASC
      LIMIT 1`,
      [userId]
    );

    let finalHeight = null;

    if (!existing) {
      // new FIRST RECORD → height REQUIRED
      if (!height) {
        return res.status(400).json({
          code: "HEIGHT_REQUIRED",
          message: "Height must be provided for first health record"
        });
      }
      finalHeight = height;
    } else {
      //  Subsequent records → reuse stored height
      finalHeight = existing.Height_cm;
    }

    const sql = `
     INSERT INTO health_record
      (user_id, height_cm, weight_kg, body_fat_percentage, bmi, recorded_date, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;

    await db.promise().query(sql, [
      userId,
      finalHeight,
      weight,
      bodyFat || null,
      bmi,
      recordedDate
    ]);

    res.json({ message: "Health record added successfully" });

  } catch (err) {
    console.error("CREATE HEALTH RECORD ERROR:", err);
    res.status(500).json({ message: "Failed to add health record" });
  }
};



// READ HEALTH RECORDS
exports.getRecords = (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  const sql = `
    SELECT *
    FROM health_record
    WHERE user_id  = ?
    ORDER BY recorded_date DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }

    res.json(results);
  });
};


// UPDATE
exports.updateRecord = (req, res) => {
  const { recordId } = req.params;
  const { weight, bodyFat, bmi } = req.body;

  db.query(
    ` UPDATE health_record
      SET
        weight_kg = ?,
        body_fat_percentage = ?,
        bmi = ?
      WHERE record_id = ?`,
    [weight, bodyFat, bmi, recordId],
    (err) => {
      if (err) return res.status(500).json({ message: "Update failed" });
      res.json({ message: "Record updated" });
    }
  );
};

// DELETE
exports.deleteRecord = (req, res) => {
  const { recordId } = req.params;

  db.query(
    "DELETE FROM health_record WHERE record_id=?",
    [recordId],
    (err) => {
      if (err) return res.status(500).json({ message: "Delete failed" });
      res.json({ message: "Record deleted" });
    }
  );
};

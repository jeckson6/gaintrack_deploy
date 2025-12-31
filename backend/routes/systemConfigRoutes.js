const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get active announcement (user side)
router.get("/announcement", async (req, res) => {
  try {
    const [[config]] = await db.promise().query(
      `
      SELECT config_value
      FROM systemconfig
      WHERE config_key = 'announcement'
        AND (expires_at IS NULL OR expires_at >= NOW())
      LIMIT 1
      `
    );

    res.json(config || null);

  } catch (err) {
    console.error("GET ANNOUNCEMENT ERROR:", err);
    res.status(500).json({ message: "Failed to load announcement" });
  }
});

module.exports = router;

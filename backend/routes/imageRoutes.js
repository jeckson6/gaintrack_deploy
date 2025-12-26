const express = require("express");
const router = express.Router();
const { getFoodImage } = require("../services/unsplashService");

// ✅ MATCH THIS PATH EXACTLY
// GET /api/images/food?name=chicken rice
router.get("/food", async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: "name query required" });
  }

  const image = await getFoodImage(name);

  res.json({
    image,
    source: "Unsplash"
  });
});

module.exports = router;

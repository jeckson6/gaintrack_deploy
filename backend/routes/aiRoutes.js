const express = require("express");
const router = express.Router();

const {
  analyzeHealth,
  getHealthSummary
} = require("../controllers/aiController");

router.get("/health-summary", getHealthSummary);
router.post("/analyze", analyzeHealth);

module.exports = router;

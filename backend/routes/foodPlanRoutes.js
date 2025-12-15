const express = require("express");
const router = express.Router();
const controller = require("../controllers/foodPlanController");

router.get("/", controller.getFoodPlansByUser);
router.post("/", controller.createFoodPlan);

module.exports = router;
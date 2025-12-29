const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const userController = require("../controllers/userController");

// ======================
// ADMIN PROFILE
// ======================
router.get("/profile", adminController.getAdminProfile);
router.get("/dashboard", adminController.getAdminDashboard);

// ======================
// USER MANAGEMENT
// ======================
router.get("/users", userController.getAllUsersWithRole);
router.post("/users/toggle", adminController.toggleUserStatus);

router.get("/users/profile", adminController.adminGetUserProfile);
router.put("/users/profile", adminController.adminUpdateUserProfile);

router.post("/admins/register", adminController.registerAdmin);
router.post("/users/remove-admin", adminController.removeAdmin);
router.post("/users", adminController.adminCreateUser);
router.delete("/users/:userId", adminController.adminDeleteUser);

// ======================
// ANALYTICS
// ======================
router.get("/analytics", adminController.getSystemAnalytics);
router.get("/analytics/training", adminController.getTrainingAnalytics);
router.get("/system-logs", adminController.getSystemLogs);

// ======================
// AI USAGE
// ======================
router.get("/ai-usage", adminController.getAIUsage);

// ======================
// ADMIN ANNOUNCEMENT
// ======================
router.post("/config", adminController.saveAnnouncement);
router.get("/config", adminController.getAnnouncement);

module.exports = router;

const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

const { register,login, getProfile,updateProfileSettings,changePassword } = require("../controllers/userController");

router.post("/register",register);
router.post("/login", login);
router.get("/profile", getProfile);
router.post("/profile", updateProfileSettings);
router.post("/password/change", userController.changePassword);


module.exports = router;

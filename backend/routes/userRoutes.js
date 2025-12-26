const express = require("express");
const router = express.Router();
const { register,login, getProfile,updateProfileSettings,changePassword } = require("../controllers/userController");

router.post("/register",register);
router.post("/login", login);
router.get("/profile", getProfile);
router.post("/profile", updateProfileSettings);
router.post("/password/change", changePassword);


module.exports = router;

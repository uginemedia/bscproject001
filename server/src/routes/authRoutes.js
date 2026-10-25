const express = require("express");
const {
  register,
  registerHospital,
  login,
  loginHospital,
  updateProfile,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);

router.post("/hospital-register", registerHospital);

router.post("/login", login);
router.post("/hospital-login", loginHospital);
router.put("/profile/:userId", updateProfile);

module.exports = router;

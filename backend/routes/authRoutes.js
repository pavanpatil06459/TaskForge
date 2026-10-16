const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getTheme,
  updateTheme,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

// protected: only logged-in user can read/update own theme
router.get("/theme", authMiddleware, getTheme);
router.put("/theme", authMiddleware, updateTheme);

module.exports = router;
const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validators/auth.validator");

const router = express.Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/me", authMiddleware, authController.me);
router.get("/google", authController.google);
router.get("/google/callback", authController.googleCallback);

module.exports = router;

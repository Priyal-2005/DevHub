// =============================================
// Auth Routes
// =============================================

const { Router } = require("express");
const passport = require("passport");
const { register, login, getMe, googleCallback } = require("../controllers/auth.controller");
const { authenticate, validate } = require("../middleware");
const { registerSchema, loginSchema } = require("../validators/auth.validator");

const router = Router();

// ─── Local Auth ────────────────────────────────

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

// ─── Protected ─────────────────────────────────

router.get("/me", authenticate, getMe);

// ─── Google OAuth ──────────────────────────────

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/auth/google/failure",
  }),
  googleCallback
);

// ─── Google Auth Failure ───────────────────────

router.get("/google/failure", (_req, res) => {
  res.status(401).json({
    success: false,
    message: "Google authentication failed",
  });
});

module.exports = router;

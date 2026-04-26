// =============================================
// Auth Controller - Request/Response Layer
// =============================================

const { ApiResponse, asyncHandler } = require("../utils");
const authService = require("../services/auth.service");

// ─── Register ──────────────────────────────────

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const { user, token } = await authService.register({ name, email, password });

  const response = ApiResponse.created({ user, token }, "Registration successful");
  res.status(response.statusCode).json(response);
});

// ─── Login ─────────────────────────────────────

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, token } = await authService.login({ email, password });

  const response = ApiResponse.ok({ user, token }, "Login successful");
  res.status(response.statusCode).json(response);
});

// ─── Get Current User ──────────────────────────

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);

  const response = ApiResponse.ok({ user }, "User profile retrieved");
  res.status(response.statusCode).json(response);
});

// ─── Google OAuth Callback ─────────────────────

const googleCallback = asyncHandler(async (req, res) => {
  // Passport attaches user to req after successful auth
  const { user, token } = await authService.findOrCreateGoogleUser(req.user);

  // Redirect to frontend with token (adjust URL for production)
  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
  res.redirect(`${clientUrl}/auth/callback?token=${token}`);
});

module.exports = { register, login, getMe, googleCallback };

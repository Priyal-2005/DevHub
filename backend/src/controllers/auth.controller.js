const passport = require("passport");
const authService = require("../services/auth.service");
const { signToken } = require("../utils/jwt");
const AppError = require("../utils/appError");

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.validated.body);
    const token = signToken(user.id);
    res.status(201).json({ token, user });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await authService.login(req.validated.body);
    const token = signToken(user.id);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, provider: user.provider },
    });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const isGoogleConfigured = () => Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

const google = (req, res, next) => {
  if (!isGoogleConfigured()) {
    return next(new AppError(503, "Google OAuth is not configured"));
  }
  return passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })(req, res, next);
};

const googleCallback = (req, res, next) => {
  if (!isGoogleConfigured()) {
    return next(new AppError(503, "Google OAuth is not configured"));
  }
  passport.authenticate("google", { session: false }, (error, user) => {
    if (error || !user) return next(error || new Error("Google auth failed"));
    const token = signToken(user.id);
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    return res.redirect(`${clientUrl}/auth/callback?token=${encodeURIComponent(token)}`);
  })(req, res, next);
};

module.exports = { register, login, me, google, googleCallback };

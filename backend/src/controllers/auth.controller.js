const passport = require("passport");
const authService = require("../services/auth.service");
const { signToken } = require("../utils/jwt");

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

const google = passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false,
});

const googleCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, (error, user) => {
    if (error || !user) return next(error || new Error("Google auth failed"));
    const token = signToken(user.id);
    return res.json({ token, user });
  })(req, res, next);
};

module.exports = { register, login, me, google, googleCallback };

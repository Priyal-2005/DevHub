// =============================================
// Passport - Google OAuth Strategy
// =============================================

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ["profile", "email"],
      },
      // Verification callback — pass profile to route handler
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          // We pass the raw profile to the controller/service layer
          // instead of doing DB work here (keeps strategy thin)
          return done(null, profile);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  // Serialize / Deserialize (minimal — we use JWT, not sessions)
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

module.exports = configurePassport;

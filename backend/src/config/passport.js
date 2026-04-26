const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");

const configurePassport = (authService) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await authService.findOrCreateGoogleUser(profile);
          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
};

module.exports = configurePassport;

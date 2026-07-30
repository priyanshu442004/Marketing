const path = require('path');
const dotenv = require('dotenv');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL = process.env.GOOGLE_CALLBACK_URL;

function buildMissingConfigResponse(res) {
  return res.status(500).json({
    success: false,
    message: 'Google OAuth is not configured',
    error: 'Missing Google OAuth credentials',
    statusCode: 500,
  });
}

if (clientID && clientSecret && callbackURL) {
  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL,
      },
      (accessToken, refreshToken, profile, done) => {
        const user = {
          googleId: profile.id,
          email: profile.emails?.[0]?.value || null,
          name: profile.displayName,
          avatar: profile.photos?.[0]?.value || null,
          accessToken,
          refreshToken,
        };

        return done(null, user);
      }
    )
  );
}

function googleLogin(req, res, next) {
  if (!clientID || !clientSecret || !callbackURL) {
    return buildMissingConfigResponse(res);
  }

  return passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })(req, res, next);
}

function googleCallback(req, res, next) {
  if (!clientID || !clientSecret || !callbackURL) {
    return buildMissingConfigResponse(res);
  }

  return passport.authenticate(
    'google',
    {
      failureRedirect: '/api/auth/google/failure',
      session: false,
    },
    (err, user) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Google authentication failed',
          error: 'Unauthorized',
          statusCode: 401,
        });
      }

      req.user = user;

      return res.status(200).json({
        success: true,
        message: 'Google authentication successful',
        user: {
          googleId: user.googleId,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        },
        statusCode: 200,
      });
    }
  )(req, res, next);
}

function googleFailure(req, res) {
  return res.status(401).json({
    success: false,
    message: 'Google authentication failed',
    error: 'Unauthorized',
    statusCode: 401,
  });
}

module.exports = {
  passport,
  googleLogin,
  googleCallback,
  googleFailure,
};
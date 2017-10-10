import express from 'express';
import passport from 'passport';

const router = express.Router();

// User login
router.post('/login', (req, res, next) => {
  // TODO: Add check for bots.
  passport.authenticate('local-login', (err, user, info) => {
    if(err) { return next(err); }
    if(!user) {
      return res.json({ success: false,
        messages: {
          password: 'Wachtwoord komt niet overeen met gebruikersnaam',
          name: 'Gebruikersnaam komt niet overeen met wachtwoord',
        },
      });
    }
    req.logIn(user, (loginErr) => {
      if(loginErr) { return next(loginErr); }
      return res.json({
        success: true,
      });
    });
  })(req, res, next);
});

export default router;

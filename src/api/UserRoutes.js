import express from 'express';
import passport from 'passport';

const router = express.Router();

// User login
router.post('/login', passport.authenticate('local-login'), (req, res) => {
  res.json({
    success: true,
  });
});

export default router;

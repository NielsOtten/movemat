import express from 'express';
import Group from '../../models/Group';

const router = express.Router();

/**
 * GET endpoint.
 * Get all the groups from the given user.
 */
router.get('/groups', (req, res) => {
  const user = req.user;

  Group.getGroups(user)
    .then((groups) => {
      res.json(groups);
    })
    .catch((err) => {
      res.json(err);
    });
});

/**
 * GET endpoint.
 * Check if user is logged in.
 */
router.get('/isLoggedIn', (req, res) => {
  res.status(401);
  if(req.user) res.status(200);
  res.end();
});

export default router;

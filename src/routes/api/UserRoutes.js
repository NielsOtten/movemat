import express from 'express';
import Group from '../../models/Group';

const router = express.Router();

/**
 * GET endpoint.
 * Get all the groups from the given user.
 */
router.get('/groups', (req, res) => {
  const user = req.user;
  console.log(user);

  Group.getGroups(user)
    .then((groups) => {
      res.json(groups);
    })
    .catch((err) => {
      res.json(err);
    });
});

export default router;

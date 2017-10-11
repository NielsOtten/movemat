import express from 'express';
import Group from '../../models/Group';

const router = express.Router();

router.get('/', async (req, res) => {
  if(!req.user) return res.json({ loggedIn: false });
  const groups = await Group.getGroupsFromUser(req.user);
  return res.json({ groups });
});

export default router;

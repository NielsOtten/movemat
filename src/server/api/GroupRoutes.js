import express from 'express';
import Group from '../../models/Group';
import Photo from '../../models/Photo';

const router = express.Router();

router.get('/', async (req, res) => {
  if(!req.user) return res.json({ loggedIn: false });
  const groups = await Group.getGroupsFromUser(req.user);
  return res.json({ groups });
});

router.get('/:id/photos', async (req, res) => {
  if(!req.user) {
    res.status(403);
    return res.json({ loggedIn: false });
  }
  const id = req.params.id;
  const group = await Group.findOne({ _id: id });
  // If group is found continue with getting photo's.
  if(group && group !== 'undefined') {
    const photos = await Photo.getPhotosWithGroup(group);
    return res.json(photos);
  }
  res.status(400);
  return res.json({ error: 'Group does not match' });
});

export default router;

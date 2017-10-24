/* eslint-disable no-underscore-dangle */
import express from 'express';
import multer from 'multer';
import Group from '../../models/Group';
import Photo from '../../models/Photo';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * Default error handling for group routes.
 */
function groupUndefined(res) {
  res.status(400);
  return res.json({ error: 'group is undefined' });
}

function userUndefined(res) {
  res.status(403);
  return res.json({ loggedIn: false });
}

function notMemberOfGroup(res) {
  res.status(403);
  return res.json({ error: 'User not member of group' });
}


/**
 * Get the groups by the user who is requesting this page.
 */
router.get('/', async (req, res) => {
  if(!req.user) return res.json({ loggedIn: false });
  const groups = await Group.getGroupsFromUser(req.user);
  return res.json({ groups });
});

/**
 * Get all the photos from the given group id.
 */
router.get('/:id/photos', async (req, res) => {
  const user = req.user;

  if(!user) {
    return userUndefined(res);
  }

  const id = req.params.id;
  const group = await Group.findOne({ _id: id });

  if(!group || group === 'undefined') {
    return groupUndefined(res);
  }

  // Check if user is member of the group.
  if(!group.memberOfGroup(user)) {
    return notMemberOfGroup(res);
  }

  // Get all the photos.
  const photos = await Photo.getPhotosWithGroup(group);
  return res.json(photos);
});

/**
 * Save the given photo's to the given group.
 */
router.post('/:id/photos', upload.array('image'), async (req, res) => {
  const user = req.user;
  const id = req.params.id;

  // Check if user is logged in.
  if(!user) {
    userUndefined(res);
  }

  const group = await Group.findOne({ _id: id });
  if(!group || group === 'undefined') {
    return groupUndefined(res);
  }

  // Check if user is member of the group.
  if(!group.memberOfGroup(user)) {
    return notMemberOfGroup(res);
  }

  const newPhotos = await Promise.all(req.files.map(async (file) => {
    // Create new photo and later add the azure data.
    const newPhoto = new Photo({
      name: file.originalname,
      user: user._id,
      group: id,
      fileType: file.mimetype,
    });

    // Try adding photo's to azure
    try {
      const newestPhoto = await newPhoto.addToAzure(file);
      newPhoto.path = `${newestPhoto.path}${newestPhoto.id}`;
      newPhoto.thumbnail = `${newestPhoto.thumbnail}${newestPhoto.id}`;
      return await newPhoto.save();
    } catch(exception) {
      console.info(exception);
    }
  }));

  if(newPhotos.length > 0) {
    return res.json(newPhotos);
  }

  res.status(400);
  return res.json({ error: 'Something went wrong' });
});

/**
 * Get Photo detail
 */
router.post('/:id/photos/:photoId', async (req, res) => {

});

export default router;

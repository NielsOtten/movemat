/* eslint-disable no-underscore-dangle */
import express from 'express';
import multer from 'multer';
import Group from '../../models/Group';
import Photo from '../../models/Photo';
import { isLoggedIn, memberOfGroup, tokenOrLoggedIn } from '../middleware';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * Get the groups by the user who is requesting this page.
 */
router.get('/', isLoggedIn, async (req, res) => {
  const groups = await Group.getGroupsFromUser(req.user);
  return res.json({ groups });
});

/**
 * Get all the photos from the given group id.
 */
router.get('/:id/photos', memberOfGroup, async (req, res) => {
  // Get all the photos.
  const photos = await Photo.getPhotosWithGroup(res.locals.group);
  return res.json(photos);
});

/**
 * Save the given photo's to the given group.
 */
router.post('/:id/photos', memberOfGroup, upload.array('image'), async (req, res) => {
  const user = req.user;
  const id = req.params.id;

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
router.get('/:id/photos/:photoId', tokenOrLoggedIn, async (req, res) => {
  const { preview } = req.query;
  const { photoId } = req.params;

  const photo = await Photo.findOne({ _id: photoId });
  const url = await photo.getPhotoFromAzure();

  if(!preview) {
    photo.downloaded = true;
    photo.save();
  }

  return res.redirect(url);
});

/**
 * Get Photo detail
 */
router.get('/:id/photos/thumbnail/:photoId', tokenOrLoggedIn, async (req, res) => {
  const { photoId } = req.params;

  const photo = await Photo.findOne({ _id: photoId });
  const url = await photo.getThumbnailFromAzure();

  return res.redirect(url);
});

export default router;

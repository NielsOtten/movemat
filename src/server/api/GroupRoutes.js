/* eslint-disable no-underscore-dangle */
import express from 'express';
import multer from 'multer';
import passport from 'passport';
import Group from '../../models/Group';
import Photo from '../../models/Photo';
import { isLoggedIn, memberOfGroup, tokenOrLoggedIn } from '../middleware';
import User from '../../models/User';

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

router.get('/:id/updatedPhotos', tokenOrLoggedIn, async (req, res) => {
  const group = res.locals.group;
  const updateQue = await group.getUpdateQueue(group);
  return res.json(updateQue);
});

/**
 * Users signup here.
 */
router.post('/:id/signup/:token', async (req, res, next) => {
  const { id, token } = req.params;
  const { login } = req.body;

  // Handle it as a user who tries to login,
  // Else create a user.
  if(login) {
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
      req.login(user, async (loginErr) => {
        if(loginErr) { return next(loginErr); }
        // Add user to group.
        const group = await Group.findOne({ _id: id, token });
        if(group && group !== 'undefined') {
          if(!group.allowedEmails.includes(user.email)) {
            console.log(user.email);
            console.log(group.allowedEmails);
            group.allowedEmails.push(user.email);
            try {
              await group.save();
            } catch(exception) {
              console.log(exception);
            }
            return res.json({
              success: true,
            });
          }
          return res.json({
            success: true,
          });
        }
      });
    })(req, res, next);
  } else {
    // Sign up
    const { email, password, username } = req.body;
    const values = { email, password, username };
    const obj = { success: false, errors: {} };
    Object.keys(values).forEach((key) => {
      if(values[key] === 'undefined' || !values[key]) {
        obj.errors[`${key}Error`] = 'Mag niet leeg zijn';
      }
    });

    if(Object.keys(obj.errors).length > 0) {
      return res.json(obj);
    }

    let user = null;
    try {
      user = await new User(values);
      await user.save();
    } catch({ errors }) {
      const newErrors = {};
      Object.keys(errors).forEach(error => newErrors[`${error}Error`] = errors[error].message);
      obj.errors = newErrors;
      return res.json(obj);
    }

    const group = await Group.findOne({ _id: id, token });
    if(group && group !== 'undefined') {
      if(!group.allowedEmails.includes(user.email)) {
        group.allowedEmails.push(user.email);
        await group.save();
        return res.json({
          success: true,
        });
      }
      return res.json({
        success: true,
      });
    }
  }
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
 * Get thumbnail detail
 */
router.get('/:id/photos/thumbnail/:photoId', tokenOrLoggedIn, async (req, res) => {
  const { photoId } = req.params;

  const photo = await Photo.findOne({ _id: photoId });
  const url = await photo.getThumbnailFromAzure();

  return res.redirect(url);
});

/**
 * Delete Photo
 */
router.delete('/:id/photos/:photoId', memberOfGroup, async (req, res) => {
  const { photoId } = req.params;
  const photo = await Photo.findOne({ _id: photoId });
  photo.deleted = true;
  photo.save();

  return res.json({ deleted: photo });
});

export default router;

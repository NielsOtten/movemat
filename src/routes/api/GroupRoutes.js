import express from 'express';
import multer from 'multer';
import Group from '../../models/Group';
import Photo from '../../models/Photo';
import User from '../../models/User';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * POST endpoint.
 * This endpoint will create a group.
 */
router.post('/', (req, res) => {
  const newGroup = new Group(req.body);

  newGroup.save()
    .then(() => {
      res.json(newGroup);
      res.end();
    })
    .catch((err) => {
      res.status(500);
      res.json(err);
      res.end();
    });
});

/**
 * Get endpoint.
 * This endpoint will get all the available groups.
 */
router.get('/', (req, res) => {
  // TODO: Add check for role and user.
  Group.find()
    .then((groups) => {
      res.json(groups);
      res.end();
    })
    .catch((err) => {
      res.status(500);
      res.json(err);
      res.end();
    });
});

/**
 * POST endpoint.
 * Add user to a group.
 * User's email needs to be in the allowed emails of the group.
 */
router.post('/:id', (req, res) => {
  const id = req.params.id;
  const user = req.user;

  Group.findOne({ _id: id })
    .then(group => group.addUser(user))
    .then((newGroup) => {
      res.json(newGroup);
      res.end();
    })
    .catch((err) => {
      res.json(err);
      res.end();
    });
});

/**
 * GET endpoint
 * Endpoint to get the token from a group.
 * Need to verify if the user is logged in.
 */
router.get('/:id/token', (req, res) => {
  const id = req.params.id;
  const user = req.user;

  Group.getToken(user, id)
    .then((token) => {
      res.json({ token });
      res.end();
    })
    .catch((err) => {
      res.json(err);
      res.end();
    });
});

/**
 * Endpoint to get all the updated photos from a group.
 * Need a token to retrieve tokens.
 */
router.get('/:id/updatedPhotos', (req, res) => {
  const token = req.query.token;
  const id = req.params.id;

  // TODO: Add this check for cast error on _id.
  // if (id.match(/^[0-9a-fA-F]{24}$/)

  Group.getUpdateQueue(id, token)
    .then((json) => {
      res.json(json);
      res.end();
    })
    .catch((err) => {
      console.log(err);
      res.status(404);
      res.json(err);
      res.end();
    });
});

/**
 * GET endpoint.
 * Endpoint to get all the photos from a group.
 */
router.get('/:id/photos', (req, res) => {
  const id = req.params.id;
  const user = req.user;

  Group.getGroup(user, id)
    .then(group => Photo.getPhotos(group))
    .then((photos) => {
      res.json(photos);
      res.end();
    })
    .catch((err) => {
      res.status(404);
      res.json(err);
      res.end();
    });
});

/**
 * GET endpoint,
 * Get the azure url of a photo and set the photo to downloaded true.
 */
router.get('/:id/photos/:photoId', (req, res) => {
  const { token, preview } = req.query;
  const { id, photoId } = req.params;

  Photo.downloadPhoto(id, photoId, token, preview)
    .then((photo) => {
      // TODO: Remove from azure.
      if(photo.deleted && photo.preview === false) return photo.remove().exec();
      return photo.getUrlFromAzure();
    })
    .then((url) => {
      res.redirect(url);
      res.end();
    })
    .catch((err) => {
      res.json(err);
      res.end();
    });
});

/**
 * DELETE endpoint.
 * This endpoint deletes a photo.
 */
router.delete('/:id/photos/:photoId', (req, res) => {
  const { id, photoId } = req.params;
  const user = req.user;

  if(!req.user) return res.end();

  Photo.prepareDeletion(id, photoId, user)
    .then((data) => {
      console.log(data);
      res.json({ newPhotos: data });
      res.end();
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
      res.end();
    });
});

/**
 * POST endpoint
 * Add all given photos to azure and add them to mongoose.
 * Multer is used to obtain the photo's from the request.
 */
router.post('/:id/photos', upload.array('image'), (req, res) => {
  const id = req.params.id;
  const user = req.user;

  if(user === undefined) {
    const messages = [];
    messages.push('Je moet ingelogd zijn om deze pagina te bekijken.');
    const redirectUri = req.url;
    res.status(403);
    res.json({
      loggedIn: false,
      redirectUri: `/login?redirectUri=${redirectUri}&messages=${messages}`,
    });
    return res.end();
  }

  Promise.all(req.files.map(file => new Promise((resolve, reject) => {
    const newPhoto = new Photo({
      name: file.originalname,
      user: user._id,
      group: id,
      fileType: file.mimetype,
    });

    return newPhoto.addToAzure(file)
      .then(() => newPhoto.save())
      .then((newestPhoto) => {
        newestPhoto.path = `${newestPhoto.path}${newestPhoto._id.toString()}`;
        return newestPhoto.save();
      })
      .then(finish => resolve(finish))
      .catch(err => reject(err));
  })))
    .then((data) => {
      res.json({ newPhotos: data });
      res.end();
    })
    .catch((err) => {
      res.json(err);
      res.end();
    });
});

export default router;

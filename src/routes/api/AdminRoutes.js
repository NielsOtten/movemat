import express from 'express';
import GroupController from '../../models/controllers/GroupController';
import UserController from '../../models/controllers/UserController';
import PhotoController from '../../models/controllers/PhotoController';

const router = express.Router();

router.use((req, res, next) => {
  if(req.user) {
    next();
  } else {
    res.redirect('/login');
  }
});

router.use('/group', new GroupController().route());
router.use('/user', new UserController().route());
router.use('/photo', new PhotoController().route());

export default router;

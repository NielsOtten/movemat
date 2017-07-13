import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { isEmail } from 'validator';
import errorMessages from '../constants/errorMessages';
import { generateRandomString } from '../utils';
import User from './User';
import Photo from './Photo';

/**
 * This is a group of users which represent a familiy.
 * A album of photo's will reference to a group.
 */
const Schema = new mongoose.Schema({
  users: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  }],
  allowedEmails: [{
    type: String,
    trim: true,
    lowercase: true,
    required: `E-mailadres ${errorMessages.REQUIRED_ERROR}.`,
    validate: {
      isAsync: true,
      validator: isEmail,
      message: `${errorMessages.VALIDATE_ERROR} e-mailadres.`,
    },
  }],
  name: {
    type: String,
    required: errorMessages.REQUIRED_ERROR,
  },
  token: {
    type: String,
    default: () => generateRandomString(30),
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
});

Schema.statics.getGroup = function getGroup(user, id) {
  return new Promise((resolve, reject) => {
    this.findOne({ _id: id, users: { $in: [user] } })
      .then(group => resolve(group))
      .catch(err => reject(err));
  });
};

Schema.statics.getGroups = function getGroups(user) {
  return new Promise((resolve, reject) => {
    this.find({ users: { $in: [user] } })
      .then(groups => resolve(groups))
      .catch(err => reject(err));
  });
};

Schema.statics.getGroupWithToken = function getGroupWithToken(id, token) {
  return new Promise((resolve, reject) => {
    this.findOne({ _id: id, token })
      .then(group => resolve(group))
      .catch(err => reject(err));
  });
};

Schema.statics.getUpdateQueue = function getUpdateQueue(id, token) {
  let searchGroup = {};
  let newPhotos = [];
  let downloadedPhotos = [];
  let deletedPhotos = [];

  return new Promise((resolve, reject) => {
    this.getGroupWithToken(id, token)
      .then(group => searchGroup = group)
      .then(() => Photo.getNewPhotos(searchGroup))
      .then((photos) => {
        newPhotos = photos;
        return Photo.getDownloadedPhotos(searchGroup);
      })
      .then(loadedPhotos => downloadedPhotos = loadedPhotos)
      .then(() => Photo.getDeletedPhotos(searchGroup))
      .then(newDeletedPhotos => deletedPhotos = newDeletedPhotos)
      .then(() => resolve({
        deleted_photos: deletedPhotos,
        updated_photos: newPhotos,
        photos: downloadedPhotos,
        group: searchGroup,
      }))
      .catch(err => reject(err));
  });
};

Schema.statics.getToken = function getToken(user, id) {
  return new Promise((resolve, reject) => {
    this.getGroup(user, id)
      .then(group => resolve(group.token))
      .catch(err => reject(err));
  });
};

Schema.methods.hasUserAccess = function hasUserAccess(givenUser) {
  return new Promise((resolve, reject) => {
    if(this.users.filter(user => user === givenUser).length > 0) resolve();
    reject();
  });
};

Schema.methods.hasUserAccessByEmail = function hasUserAccessByEmail(userEmail) {
  return new Promise((resolve, reject) => {
    if(this.users.filter(user => user.email === userEmail).length > 0) resolve();
    reject();
  });
};

Schema.methods.addUser = function addUser(user) {
  return new Promise((resolve, reject) => {
    if(this.allowedEmails.filter(email => user.email === email).length > 0) {
      this.hasUserAccess(user)
        .then(() => reject({ message: errorMessages.USER_ALREADY_REGISTERED }))
        .catch(() => {
          this.users.addToSet(user._id);
          this.save();
          resolve(this);
        });
    }
  });
};

/**
 * Not sure why i created this. It add a user with just a email.
 *
 * @param userEmail
 * @returns {Promise}
 */
Schema.methods.addUserByEmail = function addUserByEmail(userEmail) {
  return new Promise((resolve, reject) => {
    if(this.allowedEmails.filter(email => userEmail === email).length > 0) {
      this.hasUserAccessByEmail(userEmail)
        .then(() => reject({ message: errorMessages.USER_ALREADY_REGISTERED }))
        .catch(() => {
          User.getUserByEmail(userEmail)
            .then((user) => {
              this.users.addToSet(user);
              this.save();
              resolve(this);
            })
            .catch(() => reject());
        })
        .catch(() => reject());
    }
  });
};

Schema.plugin(uniqueValidator);

export default mongoose.model('Group', Schema);

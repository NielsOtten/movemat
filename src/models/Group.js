import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { isEmail } from 'validator';
import errorMessages from '../services/constants/errorMessages';
import { generateRandomString } from '../services/utils';
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

Schema.statics.getGroup = async function getGroup(user, id) {
  try {
    return await this.findOne({
      _id: id,
      $or: [{ users: { $in: [user] } }, { allowedEmails: { $in: [user.email.toString()] } }],
    });
  } catch(exception) {
    return exception;
  }
};

Schema.statics.getGroups = async function getGroups(user) {
  try {
    return this.find({ $or: [{ users: { $in: [user] } }, { allowedEmails: { $in: [user.email.toString()] } }] });
  } catch(exception) {
    return exception;
  }
};

Schema.statics.getGroupWithToken = async function getGroupWithToken(id, token) {
  try {
    return this.findOne({ _id: id, token });
  } catch(exception) {
    return exception;
  }
};

Schema.statics.getUpdateQueue = async function getUpdateQueue(id, token) {
  try {
    const group = await this.getGroupWithToken(id, token);
    const newPhotos = await Photo.getNewPhotos(group);
    const downloadedPhotos = await Photo.getDownloadedPhotos(group);
    const deletedPhotos = await Photo.getDeletedPhotos(group);

    return {
      deleted_photos: deletedPhotos,
      updated_photos: newPhotos,
      photos: downloadedPhotos,
      group,
    };
  } catch(exception) {
    return exception;
  }
};

Schema.statics.getToken = async function getToken(user, id) {
  try {
    const group = this.getGroup(user, id);
    return group.token ? group.token : null;
  } catch(exception) {
    return exception;
  }
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

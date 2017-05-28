import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { isEmail } from 'validator';
import errorMessages from '../constants/errorMessages';
import { generateRandomString } from '../utils';
import User from './User';

/**
 * This is a group of users which represent a familiy.
 * A album of photo's will reference to a group.
 */
const Schema = new mongoose.Schema({
  users: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    unique: errorMessages.UNIQUE_ERROR,
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
    unique: errorMessages.UNIQUE_ERROR,
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
// eslint-disable-next-line no-underscore-dangle
    this.findOne({ _id: id, users: [user._id] })
      .then((group) => {
        resolve(group);
      })
      .catch((err) => {
        reject(err);
      });
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
        .then(() => {
          reject({ message: errorMessages.USER_ALREADY_REGISTERED });
        })
        .catch(() => {
// eslint-disable-next-line no-underscore-dangle
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
            .catch(() => {
              reject();
            });
        })
        .catch(() => {
          reject();
        });
    }
  });
}

Schema.plugin(uniqueValidator);

export default mongoose.model('Group', Schema);

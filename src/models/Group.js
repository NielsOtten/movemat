import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { isEmail } from 'validator';
import errorMessages from '../constants/errorMessages';
import { generateRandomString } from '../utils';

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

Schema.methods.hasUserAccess = function hasUserAccess(givenUser) {
  return new Promise((resolve, reject) => {
    if(this.users.filter(user => user === givenUser).length > 0) resolve();
    reject();
  });
};

Schema.methods.addUser = function addUser(user) {
  return new Promise((resolve, reject) => {
    if(this.allowedEmails.filter(email => user.email === email).length > 0) {
      this.hasUserAccess(user)
        .then(() => {
          reject('user is already registerd.');
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

Schema.plugin(uniqueValidator);

export default mongoose.model('Group', Schema);

import mongoose from 'mongoose';
import errorMessages from '../constants/errorMessages';
import { generateRandomString } from '../utils';

/**
 * This is a group of users which represent a familiy.
 * A album of photo's will reference to a group.
 */
const Schema = new mongoose.Schema({
  users: [{
    type: String,
    ref: 'User',
  }],
  name: {
    type: String,
    required: errorMessages.REQUIRED_ERROR,
  },
  token: {
    type: String,
    unique: true,
    default: () => generateRandomString(30),
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
});

Schema.methods.getToken = function getToken(givenUser) {
  return new Promise((resolve, reject) => {
    this.hasAccess(givenUser)
      .then(() => {
        resolve(this.token);
      });
    reject();
  });
};

Schema.methods.hasUserAccess = function hasUserAccess(givenUser) {
  return new Promise((resolve, reject) => {
    if(this.users.filter(user => user === givenUser).length > 0) resolve();
    reject();
  });
};

export default mongoose.model('Group', Schema);

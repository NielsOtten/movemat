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

Schema.statics.getGroupsFromUser = async function getGroupsFromUser(user) {
  return this.find({ allowedEmails: { $in: [user.email.toString()] } });
};

Schema.methods.memberOfGroup = async function memberOfGroup(user) {
  return this.allowedEmails.includes(user.email);
};

Schema.methods.getUpdateQueue = async function getUpdateQueue() {
  const deletedPhotos = await Photo.getDeletedPhotos(this);
  const newPhotos = await Photo.getNewPhotos(this);
  const downloadedPhotos = await Photo.getDownloadedPhotos(this);

  return { deletedPhotos, newPhotos, downloadedPhotos };
};

Schema.plugin(uniqueValidator);

export default mongoose.model('Group', Schema);

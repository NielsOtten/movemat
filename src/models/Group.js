import mongoose from 'mongoose';
import errorMessages from '../constants/errorMessages';

/**
 * This is a group of users which represent a familiy.
 * A album of photo's will reference to a group.
 */
const Schema = new mongoose.Schema({
  users: [{
    type: String,
    ref: 'User'
  }],
  name: {
    type: String,
    required: errorMessages.REQUIRED_ERROR
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  }
});

export default mongoose.model('Group', Schema);
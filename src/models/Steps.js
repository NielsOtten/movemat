import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Salt work factor for BCrypt
const SALT_WORK_FACTOR = 10;

/**
 * This model is for every steps. Everytime a new WIFI steps gets configured then you have to create a new steps.
 * The steps automatically gets connected to a group.
 * The steps has a reference to the user as grand parent.
 * Every data created by the steps will refer to this model
 */
const Schema = mongoose.Schema({
  _group: {
    type: String,
    ref: 'Group',
  },
  _user: {
    type: String,
    ref: 'User',
  },
  token: {
    type: String,
    default: () => {
      // Generate hash.
      bcrypt.genSalt(SALT_WORK_FACTOR);
    },
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
});

export default mongoose.model('Steps', Schema);

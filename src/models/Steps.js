import mongoose from 'mongoose';

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
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
});

export default mongoose.model('Steps', Schema);

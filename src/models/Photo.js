import mongoose from 'mongoose';
import errorMessages from '../constants/errorMessages';

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: errorMessages.REQUIRED_ERROR,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  group: {
    type: mongoose.Schema.ObjectId,
    ref: 'Group',
  },
  fileType: {
    type: String,
  },
  absolutePath: {
    type: String,
    required: errorMessages.REQUIRED_ERROR,
  },
  path: {
    type: String,
    required: errorMessages.REQUIRED_ERROR,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
});

export default mongoose.model('Photo', Schema);
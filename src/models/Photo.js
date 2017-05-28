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
  downloaded: {
    type: Boolean,
    default: () => false,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
});

Schema.pre('save', () => {
  // Save photo aws.
});

Schema.statics.getNewPhotos = function getNewPhotos(group) {
  return new Promise((resolve, reject) => {
    if(group === null) reject({ message: 'Combination Token + Group is undefined.' });
    // eslint-disable-next-line no-underscore-dangle
    this.find({ group: group._id, downloaded: false }).sort({ timestamp: 'asc' }).exec()
      .then(photos => resolve(photos))
      .catch(err => reject(err));
  });
};

Schema.statics.getDownloadedPhotos = function getDownloadedPhotos(group) {
  return new Promise((resolve, reject) => {
// eslint-disable-next-line no-underscore-dangle
    this.find({ group: group._id, downloaded: true })
      .sort({ timestamp: 'asc' })
      .exec()
      .then((photos) => {
        resolve(photos);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export default mongoose.model('Photo', Schema);

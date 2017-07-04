import mongoose from 'mongoose';
import azure from 'azure-storage';
import errorMessages from '../constants/errorMessages';
import Group from './Group';

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
  blobName: {
    type: String,
    required: errorMessages.REQUIRED_ERROR,
  },
  fileType: {
    type: String,
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

Schema.methods.addToAzure = function addToAzure(file) {
  return new Promise((resolve, reject) => {
    const fileName = file.originalname;
    // ToDo: Check fileType.
    const blobService = azure.createBlobService();
    blobService.createContainerIfNotExists(this.group.toString(), (error, result, response) => {
      if(!error) {
        blobService.createBlockBlobFromText(this.group.toString(), fileName, file.buffer, (bloberror, blobresult, blobresponse) => {
          if(!bloberror) {
            this.path = `https://steps-upload.herokuapp.com/api/group/${this.group.toString()}/photos/`;
            this.blobName = blobresult.name;
            resolve();
          } else {
            reject(bloberror);
          }
        });
      } else {
        reject(error);
      }
    });
  });
};

Schema.methods.getUrlFromAzure = function getUrlFromAzure() {
  return new Promise((resolve, reject) => {
    const blobService = azure.createBlobService();
    const sasToken = blobService.generateSharedAccessSignature(this.group.toString(), this.blobName, { AccessPolicy: {
      Expiry: azure.date.minutesFromNow(60),
      Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
    } }, {
      contentType: this.fileType,
    });
    const url = blobService.getUrl(this.group.toString(), this.blobName, sasToken, 'https://steps.blob.core.windows.net');
    return resolve(url);
  });
};


Schema.statics.downloadPhoto = function downloadPhoto(groupId, photoId, token) {
  return new Promise((resolve, reject) => Group.getGroupWithToken(groupId, token)
    .then(() => this.getPhotoWithGroup(photoId, groupId))
    .then((photo) => {
      photo.downloaded = true;
      return photo.save();
    })
    .then(photo => resolve(photo))
    .catch(err => reject(err)));
};

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
  return new Promise((resolve, reject) =>
// eslint-disable-next-line no-underscore-dangle
     this.find({ group: group._id, downloaded: true })
      .sort({ timestamp: 'asc' })
      .exec()
      .then(photos => resolve(photos))
      .catch(err => reject(err)));
};

Schema.statics.getPhotos = function getPhotos(group) {
  return new Promise((resolve, reject) =>
// eslint-disable-next-line no-underscore-dangle
    this.find({ group: group._id })
      .sort({ timestamp: 'asc' })
      .exec()
      .then(photos => resolve(photos))
      .catch(err => reject(err)));
};

Schema.statics.getPhotoWithGroup = function getPhotoWithGroup(photoId, groupId) {
  return new Promise((resolve, reject) => this.findOne({ _id: photoId, group: groupId })
      .then(photo => resolve(photo))
      .catch(err => reject(err)));
};

export default mongoose.model('Photo', Schema);

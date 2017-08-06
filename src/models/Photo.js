import mongoose from 'mongoose';
import azure from 'azure-storage';
import sharp from 'sharp';
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
  thumbnailBlobName: {
    type: String,
    required: errorMessages.REQUIRED_ERROR,
  },
  fileType: {
    type: String,
  },
  fileExtension: {
    type: String,
  },
  path: {
    type: String,
    required: errorMessages.REQUIRED_ERROR,
  },
  thumbnail: {
    type: String,
    required: errorMessages.REQUIRED_ERROR,
  },
  downloaded: {
    type: Boolean,
    default: () => false,
  },
  deleted: {
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
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(!allowedFileTypes.includes(file.mimetype)) {
      reject('Wrong filetype');
    }
    const fileExtension = file.mimetype.replace('image/', '');
    this.fileExtension = fileExtension;
    const fileName = `${this.id}.${fileExtension}`;
    const blobService = azure.createBlobService();
    // Create group container.
    blobService.createContainerIfNotExists(this.group.toString(), (error, result, response) => {
      if(!error) {
        sharp(file.buffer)
          .resize(320, 320, {
            kernel: sharp.kernel.lanczos2,
            interpolator: sharp.interpolator.nohalo,
          })
          .background({ r: 0, g: 0, b: 0, alpha: 0 })
          .embed()
          .toBuffer()
          .then((data) => {
            // Create thumbnail
            blobService.createBlockBlobFromText(this.group.toString(), `Thumbnail/${fileName}`, data, (bloberror, blobresult, blobresponse) => {
              if(!bloberror) {
                this.thumbnail = `https://steps-upload.herokuapp.com/api/group/${this.group.toString()}/photos/thumbnail/`;
                this.thumbnailBlobName = blobresult.name;
                // Create default image
                blobService.createBlockBlobFromText(this.group.toString(), `Default/${fileName}`, file.buffer, (blobErrorDefault, blobResultDefault, blobresponsedefault) => {
                  if(!blobErrorDefault) {
                    this.path = `https://steps-upload.herokuapp.com/api/group/${this.group.toString()}/photos/`;
                    this.blobName = blobResultDefault.name;
                    resolve();
                  } else {
                    reject(blobErrorDefault);
                  }
                });
              } else {
                reject(bloberror);
              }
            });
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
    const groupId = this.group.toString();
    const sasToken = blobService.generateSharedAccessSignature(groupId, this.blobName, { AccessPolicy: {
      Expiry: azure.date.minutesFromNow(60),
      Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
    } }, {
      contentType: this.fileType,
    });
    const url = blobService.getUrl(groupId, this.blobName, sasToken, 'https://steps.blob.core.windows.net');
    return resolve(url);
  });
};

Schema.methods.getThumbnailFromAzure = function getThumbnailFromAzure() {
  return new Promise((resolve, reject) => {
    const blobService = azure.createBlobService();
    const groupId = this.group.toString();
    const sasToken = blobService.generateSharedAccessSignature(groupId, this.thumbnailBlobName, { AccessPolicy: {
      Expiry: azure.date.minutesFromNow(60),
      Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
    } }, {
      contentType: this.fileType,
    });
    const url = blobService.getUrl(groupId, this.thumbnailBlobName, sasToken, 'https://steps.blob.core.windows.net');
    return resolve(url);
  });
};

Schema.statics.prepareDeletion = function prepareDeletion(groupId, photoId) {
  return new Promise((resolve, reject) => this.findOne({ _id: photoId, group: groupId })
    .then((photo) => {
      photo.deleted = true;
      return photo.save();
    })
    .then(photo => resolve(photo))
    .catch(err => reject(err)));
};

Schema.statics.downloadPhoto = function downloadPhoto(groupId, photoId, token, preview) {
  return new Promise((resolve, reject) => Group.getGroupWithToken(groupId, token)
    .then(() => this.getPhotoWithGroup(photoId, groupId))
    .then((photo) => {
      if(!preview) {
        photo.downloaded = true;
      }
      return photo.save();
    })
    .then(photo => resolve(photo))
    .catch(err => reject(err)));
};

Schema.statics.downloadThumbnailPhoto = function downloadThumbnailPhoto(groupId, photoId, token) {
  return new Promise((resolve, reject) => Group.getGroupWithToken(groupId, token)
    .then(() => this.getPhotoWithGroup(photoId, groupId))
    .then(photo => resolve(photo))
    .catch(err => reject(err)));
};

Schema.statics.getNewPhotos = function getNewPhotos(group) {
  return new Promise((resolve, reject) => {
    if(group === null) reject({ message: 'Combination Token + Group is undefined.' });
    this.find({ group: group._id, downloaded: false, deleted: false })
      .sort({ timestamp: 'desc' })
      .exec()
      .then(photos => resolve(photos))
      .catch(err => reject(err));
  });
};

Schema.statics.getDownloadedPhotos = function getDownloadedPhotos(group) {
  return new Promise((resolve, reject) =>
     this.find({ group: group._id, downloaded: true, deleted: false })
      .sort({ timestamp: 'desc' })
      .exec()
      .then(photos => resolve(photos))
      .catch(err => reject(err)));
};

Schema.statics.getDeletedPhotos = function getDeletedPhotos(group) {
  return new Promise((resolve, reject) =>
    this.find({ group: group._id, deleted: true })
      .sort({ timestamp: 'asc' })
      .exec()
      .then(photos => resolve(photos))
      .catch(err => reject(err)));
};

Schema.statics.getPhotos = function getPhotos(group) {
  return new Promise((resolve, reject) =>
    this.find({ group: group._id, deleted: false })
      .sort({ timestamp: 'desc' })
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

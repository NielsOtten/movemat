/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import azure from 'azure-storage';
import sharp from 'sharp';
import errorMessages from '../services/constants/errorMessages';

const allowedFileTypes = [
  'image/jpeg', 'image/jpg', 'image/png',
];

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

Schema.statics.getPhotosWithGroup = async function getPhotosWithGroup(group) {
  return this.find({ group: group._id, deleted: false });
};

/**
 * This function will add the given file to azure.
 *
 * @param file
 * @return {Promise.<void>}
 */
Schema.methods.addToAzure = async function addToAzure(file) {
  console.info('adding to azure');
  // Check the mimetypes.
  if(!allowedFileTypes.includes(file.mimetype)) {
    throw new Error('File type not allowed');
  }

  this.fileExtension = file.mimetype.replace('image/', '');
  const fileName = `${this.id}.${this.fileExtension}`;

  // Get blobservice from azure.
  const blobService = azure.createBlobService();

  // Create or get container.
  const container = await new Promise((resolve, reject) => {
    blobService.createContainerIfNotExists(this.group.toString(), async (error, result, response) => {
      if(!error) {
        return resolve(result);
      }
      throw error;
    });
  });

  // Resize image for the thumbnail.
  const thumbnail = await sharp(file.buffer)
    .resize(320, 320, {
      kernel: sharp.kernel.lanczos2,
      interpolator: sharp.interpolator.nohalo,
    })
    .background({ r: 0, g: 0, b: 0, alpha: 0 })
    .embed()
    .toBuffer();

  // Create thumbnail blob.
  const thumbnailBlob = await new Promise((resolve, reject) => {
    blobService.createBlockBlobFromText(
      this.group.toString(),
      `Thumbnail/${fileName}`,
      thumbnail,
      (thumbnailError, thumbnailResult, thumbnailResponse) => {
        if(!thumbnailError) {
          return resolve(thumbnailResult);
          // TODO: Get url from local env.
        }
        throw thumbnailError;
      });
  });

  // Data for thumbnail.
  this.thumbnail = `/api/group/${this.group.toString()}/photos/thumbnail/`;
  this.thumbnailBlobName = thumbnailBlob.name;

  // Add default image to azure.
  const imageBlob = await new Promise((resolve, reject) => {
    blobService.createBlockBlobFromText(
      this.group.toString(),
      `Default/${fileName}`,
      file.buffer,
      (imageError, imageResult, imageResponse) => {
        if(!imageError) {
          return resolve(imageResult);
        }
        throw imageError;
      }
    );
  });

  this.path = `/api/group/${this.group.toString()}/photos/`;
  this.blobName = imageBlob.name;
  return this;
};

Schema.methods.getPhotoFromAzure = async function getPhotoFromAzure() {
  const blobService = azure.createBlobService();
  const groupId = this.group.toString();
  const sasToken = await blobService.generateSharedAccessSignature(groupId, this.blobName, { AccessPolicy: {
    Expiry: azure.date.minutesFromNow(60),
    Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
  } }, {
    contentType: this.fileType,
  });
  return blobService.getUrl(groupId, this.blobName, sasToken, 'https://steps.blob.core.windows.net');
};

Schema.methods.getThumbnailFromAzure = async function getThumbnailFromAzure() {
  const blobService = azure.createBlobService();
  const groupId = this.group.toString();
  const sasToken = await blobService.generateSharedAccessSignature(groupId, this.thumbnailBlobName, { AccessPolicy: {
    Expiry: azure.date.minutesFromNow(60),
    Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
  } }, {
    contentType: this.fileType,
  });
  return blobService.getUrl(groupId, this.thumbnailBlobName, sasToken, 'https://steps.blob.core.windows.net');
};

Schema.statics.getNewPhotos = function getDownloadedPhotos(group) {
  try {
    return this.find({ group: group._id, downloaded: false, deleted: false })
      .sort({ timestamp: 'desc' })
      .exec();
  } catch(exception) {
    return {
      error: 'No photos were found',
      exception,
    };
  }
};

Schema.statics.getDownloadedPhotos = async function getDownloadedPhotos(group) {
  try {
    return this.find({ group: group._id, downloaded: true, deleted: false })
      .sort({ timestamp: 'desc' })
      .exec();
  } catch(exception) {
    return {
      error: 'No photos were found',
      exception,
    };
  }
};

Schema.statics.getDeletedPhotos = async function getDownloadedPhotos(group) {
  try {
    return this.find({ group: group._id, deleted: true })
      .sort({ timestamp: 'desc' })
      .exec();
  } catch(exception) {
    return {
      error: 'No photos were found',
      exception,
    };
  }
};

export default mongoose.model('Photo', Schema);

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { isEmail } from 'validator';
import uniqueValidator from 'mongoose-unique-validator';

import errorMessages from '../constants/errorMessages';

// Salt work factor for BCrypt
const SALT_WORK_FACTOR = 10;

/**
 * This is the user model. Every user registred to the steps tool will be registred here.
 * When you add a phototo a group this user will be referenced.
 * When you join a group this user will be added to that group.
 */
const Schema = mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: `E-mailadres ${errorMessages.REQUIRED_ERROR}.`,
    validate: {
      isAsync: true,
      validator: isEmail,
      message: `${errorMessages.VALIDATE_ERROR} e-mailadres.`,
    },
    unique: errorMessages.UNIQUE_ERROR,
  },
  role: {
    type: String,
    lowercase: true,
    required: `Role ${errorMessages.REQUIRED_ERROR}`,
    default: 'anonymous_user',
  },
  username: {
    type: String,
    required: `Gebruikersnaam ${errorMessages.REQUIRED_ERROR}.`,
    unique: errorMessages.UNIQUE_ERROR,
  },
  password: {
    type: String,
    required: `Wachtwoord ${errorMessages.REQUIRED_ERROR}.`,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
});

// No arrow function, because pre save can't handle it.
// http://stackoverflow.com/questions/37365038/this-is-undefined-in-a-mongoose-pre-save-hook
// eslint-disable-next-line func-names
Schema.pre('save', function (next) {
  const user = this;

  // Generate hash.
// eslint-disable-next-line consistent-return
  bcrypt.genSalt(SALT_WORK_FACTOR, (saltErr, salt) => {
    if(saltErr) return next(saltErr);

    // hash the password along with our new salt.
    bcrypt.hash(user.password, salt, (hashErr, hash) => {
      if(hashErr) return next(hashErr);

      // override the cleartext password with the hashed one.
      user.password = hash;
      return next();
    });
  });
});

// Compare the passwords of the user
Schema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

Schema.methods.getUserByEmail = async function getUserByEmail(email) {
  try {
    return this.findOne({ email });
  } catch(exception) {
    return exception;
  }
};

Schema.plugin(uniqueValidator);

export default mongoose.model('User', Schema);

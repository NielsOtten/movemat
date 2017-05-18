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
      message: `${errorMessages.VALIDATE_ERROR} e-mailadres.`
    },
    unique: errorMessages.UNIQUE_ERROR
  },
  username: {
    type: String,
    required: `Gebruikersnaam ${errorMessages.REQUIRED_ERROR}.`,
    unique: errorMessages.UNIQUE_ERROR
  },
  password: {
    type: String,
    required: `Wachtwoord ${errorMessages.REQUIRED_ERROR}.`
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  }
});

// No arrow function, because pre save can't handle it.
// http://stackoverflow.com/questions/37365038/this-is-undefined-in-a-mongoose-pre-save-hook
Schema.pre('save', function(next) {
  console.log(this);
  const user = this;

  // Generate hash.
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);

    // hash the password along with our new salt.
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one.
      user.password = hash;
      next();
    });
  })
});

// Compare the passwords of the user
Schema.methods.comparePassword = (password, cb) => {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

Schema.plugin(uniqueValidator);

export default mongoose.model('User', Schema);
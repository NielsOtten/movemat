import LocalStrategy from 'passport-local';
import Passport from 'server/config/passport';
import User from '../../src/models/User';
import errorMessages from '../../src/services/constants/errorMessages';
import { errorMongoosify } from '../../src/services/utils/index';

class Auth {

  constructor() {
    this.passport = Passport;
  }

  initialize() {
    this.passport.serializeUser(Auth.serializeUser);
    this.passport.deserializeUser(Auth.deserializeUser);
    this.passport.use('local-login', new LocalStrategy({
      passReqToCallback: true,
    }, Auth.loginAuthenticate.bind(this)));
    this.passport.use('local-signup', new LocalStrategy({
      passReqToCallback: true,
    }, Auth.signupAuthenticate.bind(this)));
  }

  static serializeUser(user, done) {
    done(null, user.id);
  }

  static deserializeUser(id, done) {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  }

  static loginAuthenticate(req, email, password, done) {
    User.findOne({ $or: [{ email }, { username: email }] }).exec()
      .then((user) => {
        if(!user) { return done(null, false, req.flash('errors', errorMongoosify(errorMessages.PASSWORD_NOT_VALID_ERROR))); }
        if(!user.comparePassword(password)) { return done(null, false, req.flash('errors', errorMongoosify(errorMessages.PASSWORD_NOT_VALID_ERROR))); }
        return done(null, user);
      })
      .catch(err => done(err));
  }

  static signupAuthenticate(req, email, password, done) {
    User.findOne({ $or: [{ email }, { username: email }] }).exec()
      .then((user) => {
        if(user) { return done(null, false, req.flash('errors', errorMongoosify(errorMessages.SIGNUP_USER_ERROR))); }
        return true;
      })
      .then(() => {
        const user = new User(req.body);
        return user.save();
      })
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(null, false, req.flash('errors', err.errors));
      });
  }
}

export default Auth;

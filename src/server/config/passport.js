import LocalStrategy from 'passport-local';
import User from '../../models/User';
import Passport from 'passport';

class Auth {

  constructor() {
    this.passport = Passport;
  }

  initialize() {
    this.passport.serializeUser(this.serializeUser);
    this.passport.deserializeUser(this.deserializeUser);
    this.passport.use('local-login', new LocalStrategy(this.loginAuthenticate.bind(this)));
    this.passport.use('local-signup', new LocalStrategy({
      passReqToCallback: true
    },this.signupAuthenticate.bind(this)));
  }

  serializeUser(user, done) {
    done(null, user.id);
  }

  deserializeUser(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  }

  loginAuthenticate(email, password, done) {
    User.findOne({$or: [{'email': email}, {'username': email}]}).exec()
      .then(user => {
        if (!user)
          return done(null, false);
        if (!user.comparePassword(password))
          return done(null, false);

        return done(null, user);
      })
      .catch(err => {
        return done(err);
      })
  }

  signupAuthenticate(req, email, password, done) {
    User.findOne({$or: [{'email': email}, {'username': email}]}).exec()
      .then(user => {
        if (user)
          return done(null, false);
        return true;
      })
      .then(() => {
        const user = new User(req.body);

        return user.save();
      })
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err)
      })
  }
}

export default Auth;
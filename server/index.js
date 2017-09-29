import express from 'express';
import compression from 'compression';
import mongoose from 'mongoose';
import passport from 'passport';
import bodyParser from 'body-parser';
import expressSession from 'express-session';
import connectFlash from 'connect-flash';
import path from 'path';
import template from './template';
import Auth from './config/passport';
import GroupRoutes from './api/GroupRoutes';
import UserRoutes from './api/UserRoutes';
import AdminRoutes from './api/AdminRoutes';

const clientAssets = require(KYT.ASSETS_MANIFEST); // eslint-disable-line import/no-dynamic-require
const port = process.env.PORT || parseInt(KYT.SERVER_PORT, 10);
const app = express();

const mongoURL = process.env.MONGODB_URI || 'mongodb://localhost/steps';
mongoose.Promise = Promise;
mongoose.connect(mongoURL);

// Remove annoying Express header addition.
app.disable('x-powered-by');

// Compress (gzip) assets in production.
app.use(compression());

// Add bodyParser for json.
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

// Setup passport + session
app.use(expressSession({
  secret: 'StepsIsMooieDingen',
  resave: true,
  saveUninitialized: true,
}));
app.use(connectFlash());
app.use(passport.initialize());
app.use(passport.session());

const auth = new Auth();
auth.initialize();

// Setup the public directory so that we can server static assets.
app.use(express.static(path.join(process.cwd(), KYT.PUBLIC_DIR)));

const adminProtected = ({ user }, res, next) => {
  if(!user || user.role !== 'admin') { return res.redirect('/login'); }
  return next();
};

app.use('/api/group', GroupRoutes);
app.use('/api/user', UserRoutes);
app.use('/api/admin', adminProtected, AdminRoutes);

// Check if allowed or logged in
app.use(({ path: reqPath, url, user }, res, next) => {
  if(!user && !['/', '/login', '/signup', '/api/user/isLoggedIn'].includes(reqPath)) {
    return res.redirect(`/login?redirectUri=${encodeURIComponent(url)}`);
  }
  return next();
});

app.get('/admin', adminProtected, (req, res) => {
  const errors = req.flash('errors');
  return res.status(200).send(template({
    jsBundle: clientAssets.main.js,
    cssBundle: clientAssets.main.css,
    errors,
  }));
});

// Setup server side routing.
app.get('*', (req, res) => {
  const errors = req.flash('errors');
  return res.status(200).send(template({
    jsBundle: clientAssets.main.js,
    cssBundle: clientAssets.main.css,
    errors,
  }));
});

app.post('/login', passport.authenticate('local-login', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true,
}));

// Createing a user.
app.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/login',
  failureRedirect: '/signup',
  failureFlash: true,
}));

app.listen(port, () => {
  console.log(`✅  server started on port: ${port}`); // eslint-disable-line no-console
});

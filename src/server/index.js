
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
import Group from '../models/Group';
import Photo from '../models/Photo';

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

// Sprint 1 return json with images.
app.get('/group/oma1/photos', (req, res) => {
  const url = `${req.protocol}://${req.get('host')}`;

  const json = {
    updated_photos: [
      {
        _id: '1',
        name: 'photo1',
        url: `${url}/images/fam-jan.jpg`,
      },
      {
        _id: '2',
        name: 'photo2',
        url: `${url}/images/fam-jan-2.jpg`,
      },
      {
        _id: '3',
        name: 'photo3',
        url: `${url}/images/fam-xander.jpg`,
      },
    ],
    photos: [
      {
        _id: '4',
        name: 'photo4',
        url: `${url}/images/oma.JPG`,
      },
      {
        _id: '5',
        name: 'photo5',
        url: `${url}/images/xander.JPG`,
      },
      {
        _id: '6',
        name: 'photo6',
        url: `${url}/images/xander-baby.JPG`,
      },
      {
        _id: '7',
        name: 'photo7',
        url: `${url}/images/xander-young.JPG`,
      },
    ],
  };

  res.json(json);
});

/**
 * Endpoint to get the token from a group.
 * Need to verify if the user is logged in.
 */
app.get('/api/group/:id/token', (req, res) => {
  const id = req.params.id;
  const user = req.user;

  Group.getGroup(user, id)
    .then((group) => {
      res.json({ token: group.token });
      res.end();
    })
    .catch((err) => {
      res.json(err);
      res.end();
    });
});

/**
 * Endpoint to get all the updated photos from a group.
 * Need a token to retrieve tokens.
 */
app.get('/api/group/:id/photos', (req, res) => {
  const token = req.query.token;
  const id = req.params.id;
  let searchGroup = {};
  let newPhotos = [];
  let downloadedPhotos = [];

  // Add this check for cast error on _id.
  // if (id.match(/^[0-9a-fA-F]{24}$/)

  Group.findOne({ _id: req.params.id, token })
    .then(group => searchGroup = group)
    .then(() => newPhotos = Photo.getNewPhotos(searchGroup))
    .then(() => downloadedPhotos = Photo.getDownloadedPhotos(searchGroup))
    .then(() => {
      res.json({
        updated_photos: newPhotos,
        photos: downloadedPhotos,
        group: searchGroup,
      });
      res.end();
    })
    .catch((err) => {
      res.status(404);
      res.json(err);
      res.end();
    });
});

/**
 * Add user to a group.
 * User's email needs to be in the allowed emails of the group.
 */
app.post('/api/group/:id', (req, res) => {
  const id = req.params.id;
  const user = req.user;
  const email = req.query.email;

  Group.findOne({ _id: id })
    .then(group => group.addUser(user))
    .then((newGroup) => {
      res.json(newGroup);
      res.end();
    })
    .catch(() => {
      console.log('nope, not going to work.');
    });
});

app.get('/api/user/groups', (req, res) => {
  Group.getGroups(req.user)
    .then((groups) => {
      res.json(groups);
    })
    .catch((err) => {
      res.json(err);
    });
});

// Setup server side routing.
app.get('*', (req, res) => {
  const messages = [];
// eslint-disable-next-line no-useless-escape
  const url = req.originalUrl.split('?').shift();
  const allowed = ['', '/', '/login', '/signup'].filter((allowedPath) => {
    return url === allowedPath;
  }).length;
  if(allowed <= 0 && !req.user) {
    messages.push('Je moet ingelogd zijn om deze pagina te bekijken.');
    const redirectUri = req.url;
    res.redirect(`/login?redirectUri=${redirectUri}&messages=${messages}`);
    return res.end();
  }

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

/**
 * Endpoint to create a group.
 */
app.post('/api/group', (req, res) => {
  const newGroup = new Group(req.body);
  newGroup.save();

  res.json(newGroup);
});

app.listen(port, () => {
  console.log(`✅  server started on port: ${port}`); // eslint-disable-line no-console
});

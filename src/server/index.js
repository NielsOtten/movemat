
import express from 'express';
import compression from 'compression';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import RouterContext from 'react-router/lib/RouterContext';
import createMemoryHistory from 'react-router/lib/createMemoryHistory';
import match from 'react-router/lib/match';
import template from './template';
import routes from '../routes';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import passport from 'passport';
import expressSession from 'express-session';
import auth from './config/passport';

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
  extended: true
}));
app.use(bodyParser.json());

// Setup passport + session
app.use(expressSession({secret: 'StepsIsMooieDingen'}));
app.use(passport.initialize());
app.use(passport.session());

const Auth = new auth();
Auth.initialize();

// Setup the public directory so that we can server static assets.
app.use(express.static(path.join(process.cwd(), KYT.PUBLIC_DIR)));

// Sprint 1 return json with images.
app.get('/group/oma1/photos', (req, res) => {
  const url = `${req.protocol}://${req.get('host')}`;

  const json = {
    'updated_photos': [
      {
        '_id': '1',
        'name': 'photo1',
        'url': url + '/images/fam-jan.jpg'
      },
      {
        '_id': '2',
        'name': 'photo2',
        'url': url + '/images/fam-jan-2.jpg'
      },
      {
        '_id': '3',
        'name': 'photo3',
        'url': url + '/images/fam-xander.jpg'
      }
    ],
    'photos': [
      {
        '_id': '4',
        'name': 'photo4',
        'url': url + '/images/oma.JPG'
      },
      {
        '_id': '5',
        'name': 'photo5',
        'url': url + '/images/xander.JPG'
      },
      {
        '_id': '6',
        'name': 'photo6',
        'url': url + '/images/xander-baby.JPG'
      },
      {
        '_id': '7',
        'name': 'photo7',
        'url': url + '/images/xander-young.JPG'
      }
    ]
  };

  res.json(json);
});

// Setup server side routing.
app.get('*', (request, response) => {
  const history = createMemoryHistory(request.originalUrl);

  match({ routes, history }, (error, redirectLocation, renderProps) => {
    if (error) {
      response.status(500).send(error.message);
    } else if (redirectLocation) {
      response.redirect(302, `${redirectLocation.pathname}${redirectLocation.search}`);
    } else if (renderProps) {
      // When a React Router route is matched then we render
      // the components and assets into the template.
      response.status(200).send(template({
        root: renderToString(<RouterContext {...renderProps} />),
        jsBundle: clientAssets.main.js,
        cssBundle: clientAssets.main.css,
      }));
    } else {
      response.status(404).send('Not found');
    }
  });
});

app.post('/login', passport.authenticate('local-login', {
  successRedirect : '/tools',
  failureRedirect : '/login',
}));

// Createing a user.
app.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/login',
  failureRedirect : '/signup',
}));

app.listen(port, () => {
  console.log(`✅  server started on port: ${port}`); // eslint-disable-line no-console
});

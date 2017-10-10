import Express from 'express';
import compression from 'compression';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import passport from 'passport';
import connectFlash from 'connect-flash';
import expressSession from 'express-session';

import Auth from './passport';
import Api from './api';

const publicPath = __dirname;
const app = Express();

const port = parseInt(process.env.PORT || 3000, 10);

const mongoURL = process.env.MONGODB_URI || 'mongodb://localhost/steps';
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
app.use(Express.static(publicPath));

// Setup api routes.
app.use('/api', Api);

app.get('/login', (req, res, next) => {
  console.log(`user: ${req.user}`);
  return next();
});

app.get('*', (req, res) => {
  res.sendFile(`${publicPath}/index.html`);
});

app.listen(port);
console.info(`✅  server started on port: ${port}`);

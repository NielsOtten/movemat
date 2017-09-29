const Express = require('express');
const compression = require('compression');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const connectFlash = require('connect-flash');
const expressSession = require('express-session');

const Auth = require('./passport');

const publicPath = path.join(__dirname, '../build/public');
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

app.use((req, res) => res.sendFile(`${publicPath}/index.html`));

app.listen(port);
console.info(`✅  server started on port: ${port}`);

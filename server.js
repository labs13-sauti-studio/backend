require('dotenv').config();
const path = require('path');
const express = require('express');
const passport = require('passport');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};
const server = express();
const cookieSession = require('cookie-session');
const Pusher = require('pusher');
const bodyParser = require('body-parser');
const passportSetup = require('./config/passport-setup');
const UsersRouter = require('./controllers/users-router');
const WorkflowsRouter = require('./controllers/workflows-router');
const ClientsRouter = require('./controllers/clients-router');
const ResponsesRouter = require('./controllers/responses');
const UssdRouter = require('./controllers/ussd-router');
const AuthRouter = require('./controllers/auth-router');
const authCheck = require('./controllers/authCheck');
const ProfileRouter = require('./controllers/profile-router');
const credentials = require('./config/africas-talking');
const africastalking = require('africastalking')(credentials.AT);

const pusher = new Pusher(credentials.pusher);

// middleware
server.use(
  cookieSession({
    name: 'cookie',
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.SESSION_COOKIE],
    secure: false,
    // httpOnly: true,
    signed: true,
  })
);
server.use(helmet());
server.use(express.json());
server.use(bodyParser.urlencoded({ extended: false }));
// server.use(bodyParser());
server.use(cors(corsOptions));
server.use(morgan('dev'));

// initialize passport
server.use(passport.initialize());
server.use(passport.session());

//  Register and login routes
server.use('/auth', AuthRouter);

// endpoints
server.use('/profile', ProfileRouter);
server.use('/users', authCheck, UsersRouter);
server.use('/workflows', WorkflowsRouter);
server.use('/clients', ClientsRouter);
server.use('/responses', ResponsesRouter);
server.use('/ussd', UssdRouter);
server.get('/', (req, res) => {
  res.send(`We're live! Please Login.`);
});

server.get('/home', (req, res) => {
  res.status(200).json({ message: 'Success' });
});

// Logout route
server.get('/logout', (req, res) => {
  req.logOut();
  res.status(400).redirect(`${process.env.FRONTEND_URL}`);
});

// ENDPOINT FOR HOMEPAGE
server.get('/', function(req, res) {
  res.sendFile(path.join(`${__dirname}/index.html`));
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server is live at ${port}`);
});

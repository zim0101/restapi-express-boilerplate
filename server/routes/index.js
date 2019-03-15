import Users from '../controllers/user';
import DataStore from '../controllers/data';
import passport from 'passport';
import cors from 'cors';
import isUser from '../middleware/isUser';

require('../config/passport')(passport);

export default (app) => {

  var corsOptions = {
    // Your front-end app domain, can be more than one
    origin: 'http://localhost:3001',
    optionsSuccessStatus: 200 
  }


  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the REST API Boilerplate!',
  }));

  // -------------------------- User Authentication Routes -------------------------------
  app.post('/api/sign-up', cors(corsOptions), Users.signUp);
  app.post('/api/sign-in', cors(corsOptions), Users.signin);
  // -------------------------- API Routes with middlewares and API authentication -------------------------------
  app.post('/api/data/create', cors(corsOptions), passport.authenticate('jwt', {session: false}) , DataStore.create);
  app.get('/api/data/list', cors(corsOptions), passport.authenticate('jwt', {session: false}), DataStore.getAllData);

  // -------------------------- Phone verification -------------------------------
  app.post('/api/send-phone-verification-code', cors(corsOptions), passport.authenticate('jwt', {session: false}), Users.sendPhoneVerificationCode);
  app.post('/api/verify-phone', cors(corsOptions), passport.authenticate('jwt', {session: false}), Users.phoneVerification);

};


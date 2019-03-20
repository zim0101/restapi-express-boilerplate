import Users from '../controllers/user';
import DataStore from '../controllers/data';
import Stripe from '../controllers/stripe';
import passport from 'passport';
import cors from 'cors';

require('../config/passport')(passport);
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const mime = require('mime');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            cb(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype));
        });
    }
});
let upload = multer({ storage: storage });




export default (app) => {

    let corsOptions = {
        // Your front-end app domain, can be more than one
        origin: 'http://localhost:3001',
        optionsSuccessStatus: 200
    };



    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the REST API Boilerplate!',
    }));

    // -------------------------- User Authentication Routes -------------------------------

    app.post('/api/sign-up', cors(corsOptions), Users.signUp);
    app.post('/api/sign-in', cors(corsOptions), Users.signin);

    // -------------------------- API Routes with middleman's and API authentication -------------------------------

    app.post('/api/data/create', cors(corsOptions), passport.authenticate('jwt', {session: false}) , DataStore.create);
    app.get('/api/data/list', cors(corsOptions), passport.authenticate('jwt', {session: false}), DataStore.getAllData);
    app.post('/api/data/update', cors(corsOptions), passport.authenticate('jwt', {session: false}), DataStore.updateData);
    app.post('/api/data/delete', cors(corsOptions), passport.authenticate('jwt', {session: false}), DataStore.deleteData);
    app.post('/api/data/file', cors(corsOptions), passport.authenticate('jwt', {session: false}), upload.single('file'), DataStore.checkFile);
    app.get('/api/data/image', function(req, res) {
        let pathname = path.join(__dirname, '../../uploads/cbb5fa48f07997471dae19cdf97111cc1552994074652.png');
        res.sendFile(pathname);
    });

    app.post('/api/data/bitcoin', cors(corsOptions), passport.authenticate('jwt', {session: false}), DataStore.bitcoinAPI);

    // -------------------------- Phone verification -------------------------------

    app.post('/api/send-phone-verification-code', cors(corsOptions), passport.authenticate('jwt', {session: false}), Users.sendPhoneVerificationCode);
    app.post('/api/verify-phone', cors(corsOptions), passport.authenticate('jwt', {session: false}), Users.phoneVerification);

    // -------------------------- google2FA verification -------------------------------

    app.post('/api/google-two-factor-verification', cors(corsOptions), passport.authenticate('jwt', {session: false}), Users.generateQRcodeGoogle2FA);
    app.post('/api/verify-google-verification-code', cors(corsOptions), passport.authenticate('jwt', {session: false}), Users.verifyGoogleAuthenticatorCode);

    // -------------------------- Stripe testing ----------------------------------------

    app.post('/api/stripe-testing', Stripe.payToTestAccount);

};
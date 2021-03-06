import model from '../models';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const {User} = model;
const authy = require("authy")("bAMe6nyqbfWHsbuAnuF2j8WCNQE38r3C");
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
require('../config/passport')(passport);

// ---------------------------------------- Custom function ----------------------------------------
const getToken = (headers) => {
    if (headers && headers.authorization) {
        let parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};



class Users {
    static signUp(req, res) {
        const {
            name,
            username,
            email,
            password,
            phone,
            country_code
        } = req.body;
        const type = "user";
        return User
            .create({
                name,
                username,
                email,
                password,
                type,
                phone,
                country_code
            })
            .then(userData => res.status(201).send({
                success: true,
                message: 'User successfully created',
                userData
            }))
            .catch((error) => res.status(400).send(error));
    }

    static signin(req, res) {
        return User
            .find({
                where: {
                    username: req.body.username
                }
            })
            .then((user) => {
                if (!user) {
                    return res.status(401).send({
                        message: 'Authentication failed. User not found.',
                    });
                }
                user.comparePassword(req.body.password, (err, isMatch) => {
                    if (isMatch && !err) {
                        let token = jwt.sign(JSON.parse(JSON.stringify(user)), 'nodeauthsecret', {
                            expiresIn: 86400 * 30
                        });
                        jwt.verify(token, 'nodeauthsecret', function(err, data) {
                            console.log(err, data);
                        });
                        res.json({
                            success: true,
                            token: 'JWT ' + token
                        });
                    } else {
                        res.status(401).send({
                            success: false,
                            msg: 'Authentication failed. Wrong password.'
                        });
                    }
                })
            })
            .catch((error) => res.status(400).send(error));
    }

    static userType(req, res) {
        return User
            .findOne({
                where: {
                    username: req.body.username
                }
            })
            .then((user) => {
                if (!user) {
                    return res.status(401).send({
                        message: 'User not found.'
                    });
                } else {
                    return res.status(200).send(user.type);
                }
            })
            .catch((error) => res.status(400).send(error));
    }

    static sendPhoneVerificationCode(req, res) {

        const phone = req.body.phone;
        const country_code = req.body.country_code;
        const via = "sms";
        let authy_response = {};

        authy.phones().verification_start(phone, country_code, via, function(error, response) {
            if (error) {
                console.log(error);
                authy_response = {
                    type: 'failed',
                    error: error
                };
            } else {
                console.log(response);
                authy_response = {
                    type: 'success',
                    response: response
                };
            }
        });

        if (authy_response.type === 'success') {
            return res.status(200).send(authy_response);
        } else {
            return res.status(400).send(authy_response);
        }

    }

    static phoneVerification(req, res) {

        const phone = req.body.phone;
        const country_code = req.body.country_code;
        const verification_code = req.body.verification_code;
        let authy_response = {};

        authy.phones().verification_check(phone, country_code, verification_code, function(error, response) {
            if (error) {
                // invalid token  
                console.log(error);
                authy_response = {
                    type: 'failed',
                    error: error
                };
                console.log(authy_response);
            } else {
                console.log(response);
                authy_response = {
                    type: 'success',
                    response: response
                };
                console.log(authy_response);
            }
        });

        if (authy_response.type === 'success') {
            return res.status(200).send(authy_response);
        } else {
            return res.status(400).send(authy_response);
        }
    }

    static generateQRcodeGoogle2FA(req, res) {

        const token = getToken(req.headers);
        const username = req.body.username;

        if (token) {
            
            let secret = speakeasy.generateSecret({
                length: 20
            });
            
            User
                .update({ google_2fa_secret: secret.base32 }, { where: { username: username } } )
                .then((user) => {
                    if(!user) {
                        return res.status(401).send({
                            status: 'failed',
                            message: 'User not found!'
                        });
                    } else {
                        QRCode.toDataURL(secret.otpauth_url, function(err, image_data) {
                            if(!err) {
                                console.log("Image Data: ", image_data);
                                return res.status(200).send(image_data);
                            } else {
                                console.log(err);
                                return res.status(400).send(err);
                            }
                        });
                    }
                })
                .catch((error) => res.status(400).send(error));

        } else {
            return res.status(403).send({
                success: false,
                message: "Unauthorized"
            });
        }

    }

    static async verifyGoogleAuthenticatorCode(req, res) {

        const google_verification_code = req.body.google_verification_code;
        const username = req.body.username;

        let user = await User
                      .findOne({where: {username: username}})
                      .then((user) => {
                          if(!user) {
                            return null;
                          } else {
                            return user;
                          }
                      })
                      .catch((error) => console.log(error));
        let secret = user.dataValues.google_2fa_secret;

        let verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: google_verification_code
        });

        if(!verified) {
            return res.status(400).send({
                message: 'Code not verified',
                data: verified,
                secret: secret
            });
        } else {
            return res.status(200).send({
              message: 'Verified!!!!!!!!!!!!',
              secret: secret
            });
        }
    }
}

export default Users;
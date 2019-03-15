import model from '../models';
import jwt from 'jsonwebtoken';
import passport from 'passport';
require('../config/passport')(passport);
const authy = require("authy")("bAMe6nyqbfWHsbuAnuF2j8WCNQE38r3C");



const { User } = model;

class Users {
  static signUp(req, res) {
    const { name, username, email, password } = req.body;
    const type = "user";
      return User
        .create({
          name,
          username,
          email,
          password,
          type
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
            if(isMatch && !err) {
              var token = jwt.sign(JSON.parse(JSON.stringify(user)), 'nodeauthsecret', {expiresIn: 86400 * 30});
              jwt.verify(token, 'nodeauthsecret', function(err, data){
                console.log(err, data);
              })
              res.json({success: true, token: 'JWT ' + token});
            } else {
              res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
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
                if(!user) {
                    return res.status(401).send({message: 'User not found.'});
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

      authy.phones().verification_start(phone, country_code, via, function(err, res) {
        if (err) {
          console.log(err);
          return res.status(400).send(err);
        } else {
          console.log(res.message);
          return res.status(200).send(res.message);
        }
      });
      
    }

    static phoneVerification(req, res) {

      const phone = req.body.phone;
      const country_code = req.body.country_code;
      // const via = "sms";
      const verification_code = req.body.verification_code;

      authy.phones().verification_check(phone, country_code, verification_code, function (error, response) {
        if (error) {
          // invalid token  
          console.log(error);
          return res.status(400).send(error);
        } else {
          console.log(response);
          return res.status(200).send(response);
        }
      });
    }

}

export default Users;
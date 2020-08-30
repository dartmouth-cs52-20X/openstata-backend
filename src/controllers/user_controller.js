/* eslint-disable consistent-return */
import dotenv from 'dotenv';
import jwt from 'jwt-simple';
import User from '../models/user_model';

dotenv.config({ silent: true });

export const signin = (req, res, next) => {
  console.log('signing in');
  res.send({ token: tokenForUser(req.user), username: req.user.username });
};

export const changePassword = (req, res, next) => {
  // const { username } = req.body; can do just change userProfile?

  if (!req.body.newPassword) {
    return res.status(422).send('You must provide a valid new password');
  }

  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        user.password = req.body.newPassword;
        user.save()
          .then(() => {
            res.send('Sucessful change');
          });
      } else {
        res.status(422).send('You must provide the email of an existing user');
      }
    });
};

export const signup = (req, res, next) => {
  const { email } = req.body;
  const { password } = req.body;
  const { username } = req.body;

  if (!email || !password || !username) {
    return res.status(422).send('You must provide email + password + username');
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        res.status(406).send({ error: 'You already have an account' });
      } else {
        const newUser = new User();
        newUser.email = email;
        newUser.password = password;
        newUser.username = username;
        newUser.save()
          .then((newUserToken) => {
            console.log('success');
            res.send({ token: tokenForUser(newUserToken) });
          })
          .catch((error) => {
            res.status(406).send(error);
          });
      }
    }).catch((error) => {
      console.log('some error');
      res.status(406).send(error);
    });
};

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}

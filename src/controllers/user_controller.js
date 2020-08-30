/* eslint-disable consistent-return */
import dotenv from 'dotenv';
import jwt from 'jwt-simple';
import User from '../models/user_model';
import { addTutorials } from './dofile_controller';

dotenv.config({ silent: true });

export const signin = (req, res, next) => {
  console.log('signing in');
  res.json({ token: tokenForUser(req.user), username: req.user.username });
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
            res.json({ result: 'Sucessful change' });
          });
      } else {
        res.status(422).json({ error: 'Must be an existing user' });
      }
    });
};

export const signup = async (req, res, next) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(422).send('You must provide email + password + username');
  }

  try {
    const user = await User.findOne({ email });
    if (user) return res.status(406).json({ error: 'You already have an account' });

    const newUser = new User({ email, password, username });
    const newUserToken = await newUser.save();
    await addTutorials(newUser._id);

    console.log('success creating user');
    res.json({ token: tokenForUser(newUserToken) });
  } catch (error) {
    console.log(error);
    res.status(406).json(error);
  }
};

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}

require('dotenv').config();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
var { expressjwt: expressJwt } = require('express-jwt');

const signup = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    return res.status(403).json({
      error: 'Email already exists',
    });
  } else {
    const user = await new User(req.body);
    await user.save();
    res.status(200).json({
      message: 'Signup successfully! Log in!',
    });
  }
};

const signin = (req, res) => {
  //find the user based on email
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: 'User with that email does not exists. Please sign in again',
      });
    } else {
      if (!user.authenticate(req.body.password)) {
        return res.status(401).json({
          error: 'Email and password do not match',
        });
      } else {
        //make a token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        //persists token in cookie
        res.cookie('t', token, { expire: new Date() + 9999 });

        const { _id, username, email } = user;
        return res.json({ token, user: { _id, email, username } });
      }
    }
  });
};

const signout = (req, res) => {
  res.clearCookie('t');
  return res.json({ message: 'Signout success!' });
};

const requireSignin = expressJwt({
  // if the token is valid, express jwt appends the verified users id
  //in auth key to the req
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'], // added later
  userProperty: 'auth',
});

module.exports = {
  requireSignin,
  signout,
  signup,
  signin,
};

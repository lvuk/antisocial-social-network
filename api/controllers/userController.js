const User = require('../models/userModel');
const _ = require('lodash');

const userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: 'User not found' });
    }

    //adds profile object to req
    req.profile = user;
    next();
  });
};

const hasAuthorization = (req, res, next) => {
  const authorize = req.profile && req.auth && req.profile._id === req.auth._id;
  if (!authorize)
    return res.status(403).json({ error: 'User is not authorized' });

  next();
};

const getAllUsers = (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.json({ users: users });
  }).select('username email updated created');
};

const getUser = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  res.json(req.profile);
};

const updateUser = (req, res, next) => {
  let user = req.profile;
  user = _.extend(user, req.body); //mutate the source object
  user.updated = Date.now();
  user.save((err) => {
    if (err)
      return res
        .status(400)
        .json({ error: 'You are not authorized to perform this action' });

    user.hashed_password = undefined;
    user.salt = undefined;
    res.json({ user: user });
  });
};

const deleteUser = (req, res) => {
  let user = req.profile;
  user.remove((err, deletedUser) => {
    if (err) res.status(400).json({ error: 'Error' });
    else res.json({ msg: 'User successfully deleted', deletedUser });
  });
};

module.exports = {
  userById,
  hasAuthorization,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};

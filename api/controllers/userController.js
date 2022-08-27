const User = require('../models/userModel');
const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');

const userById = (req, res, next, id) => {
  User.findById(id)
    .populate('following', '_id username')
    .populate('followers', '_id username')
    .exec((err, user) => {
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
    res.json(users);
  }).select('username email updated created');
};

const getUser = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  res.json(req.profile);
};

// const updateUser = (req, res, next) => {
//   let user = req.profile;
//   user = _.extend(user, req.body); //mutate the source object
//   user.updated = Date.now();
//   user.save((err) => {
//     if (err)
//       return res
//         .status(400)
//         .json({ error: 'You are not authorized to perform this action' });

//     user.hashed_password = undefined;
//     user.salt = undefined;
//     res.json({ user: user });
//   });
// };

const updateUser = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err)
      return res.status(400).json({ error: 'Photo could not be uploaded' });

    let user = req.profile;
    user = _.extend(user, fields);
    user.updated = Date.now();

    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.filepath);
      user.photo.contentType = files.photo.type;
    }
    user.save((err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    });
  });
};

const userPhoto = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set('Content-Type', req.profile.photo.contentType);
    return res.send(req.profile.photo.data);
  }
  next();
};

const deleteUser = (req, res) => {
  let user = req.profile;
  user.remove((err, deletedUser) => {
    if (err) res.status(400).json({ error: 'Error' });
    else res.json({ msg: 'User successfully deleted', deletedUser });
  });
};

//follow unfollow
const addFollowing = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body.userId,
    { $push: { following: req.body.followId } },
    (err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      next();
    }
  );
};

const addFollower = (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    { $push: { followers: req.body.userId } },
    { new: true }
  )
    .populate('following', '_id username')
    .populate('followers', '_id username')
    .exec((err, result) => {
      if (err) {
        return res.sstatus(400).json({ error: err });
      }
      result.hashed_password = undefined;
      result.salt = undefined;
      res.json(result);
    });
};

const removeFollowing = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body.userId,
    { $pull: { following: req.body.unfollowId } },
    (err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      next();
    }
  );
};

const removeFollower = (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    { $pull: { followers: req.body.userId } },
    { new: true }
  )
    .populate('following', '_id username')
    .populate('followers', '_id username')
    .exec((err, result) => {
      if (err) {
        return res.sstatus(400).json({ error: err });
      }
      result.hashed_password = undefined;
      result.salt = undefined;
      res.json(result);
    });
};

const findPeople = (req, res) => {
  let following = req.profile.following;
  following.push(req.profile._id);
  User.find({ _id: { $nin: following } }, (err, users) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.json(users);
  }).select('username');
};

module.exports = {
  userById,
  hasAuthorization,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  userPhoto,
  addFollower,
  addFollowing,
  removeFollower,
  removeFollowing,
  findPeople,
};

const express = require('express');
const {
  userById,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  userPhoto,
  addFollowing,
  addFollower,
  removeFollower,
  removeFollowing,
} = require('../controllers/userController');
const { requireSignin } = require('../controllers/authController');

const router = express.Router();

router.put('/user/follow', requireSignin, addFollowing, addFollower);
router.put('/user/unfollow', requireSignin, removeFollowing, removeFollower);

router.get('/users', getAllUsers);
router.get('/user/:userId', requireSignin, getUser);
router.put('/user/:userId', requireSignin, updateUser);
router.delete('/user/:userId', requireSignin, deleteUser);
//photo
router.get('/user/photo/:userId', userPhoto);

//any route containg :userId, our app will first exec userByID()
router.param('userId', userById);

module.exports = router;

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
  findPeople,
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
//who to follow
router.get('/user/findpeople/:userId', requireSignin, findPeople);

//any route containg :userId, our app will first exec userByID()
router.param('userId', userById);

module.exports = router;

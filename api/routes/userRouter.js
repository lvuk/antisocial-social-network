const express = require('express');
const {
  userById,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { requireSignin } = require('../controllers/authController');

const router = express.Router();

router.get('/users', getAllUsers);
router.get('/user/:userId', requireSignin, getUser);
router.put('/user/:userId', requireSignin, updateUser);
router.delete('/user/:userId', requireSignin, deleteUser);

//any route containg :userId, our app will first exec userByID()
router.param('userId', userById);

module.exports = router;

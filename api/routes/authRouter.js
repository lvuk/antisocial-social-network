const express = require('express');
const { signup, signin, signout } = require('../controllers/authController');
const { userById } = require('../controllers/userController');
const postValidator = require('../validators/postValidator');
const { userSignupValidator } = require('../validators/userValidator');

const router = express.Router();

router.post('/signup', userSignupValidator, signup);
router.post('/signin', signin);
router.get('/signout', signout);

//any route containg :userId, our app will first exec userByID()
router.param('userId', userById);

module.exports = router;

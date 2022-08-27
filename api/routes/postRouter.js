const express = require('express');
const {
  getAllPosts,
  createPost,
  getPostsByUser,
  postById,
  isCreator,
  deletePost,
  updatePost,
} = require('../controllers/postController');
const {
  createPostValidator,
  validateTimeForPost,
} = require('../validators/postValidator');
const { requireSignin } = require('../controllers/authController');
const { userById } = require('../controllers/userController');

const router = express.Router();

router.get('/posts', requireSignin, getAllPosts);
router.post(
  '/post/new/:userId',
  requireSignin,
  validateTimeForPost,
  createPost,
  createPostValidator
);
router.get('/posts/by/:userId', requireSignin, getPostsByUser);
router.delete('/post/:postId', requireSignin, isCreator, deletePost);
router.put('/post/:postId', requireSignin, isCreator, updatePost);

//any route containg :userId, our app will first exec userByID()
router.param('userId', userById);
router.param('postId', postById);

module.exports = router;

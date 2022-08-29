const express = require('express');
const {
  getAllPosts,
  createPost,
  getPostsByUser,
  postById,
  isCreator,
  deletePost,
  updatePost,
  postPhoto,
  getSinglePost,
} = require('../controllers/postController');
const {
  createPostValidator,
  validateTimeForPost,
} = require('../validators/postValidator');
const { requireSignin } = require('../controllers/authController');
const { userById } = require('../controllers/userController');

const router = express.Router();

router.get('/posts', getAllPosts);
router.get('/post/:postId', getSinglePost);
router.post('/post/new/:userId', requireSignin, createPost);
router.get('/posts/by/:userId', requireSignin, getPostsByUser);
router.delete('/post/:postId', requireSignin, isCreator, deletePost);
router.put('/post/:postId', requireSignin, isCreator, updatePost);
//photo
router.get('/post/photo/:postId', postPhoto);

//any route containg :userId, our app will first exec userByID()
router.param('userId', userById);
router.param('postId', postById);

module.exports = router;

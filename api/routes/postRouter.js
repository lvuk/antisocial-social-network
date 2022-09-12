const express = require('express');
const {
  getAllPosts,
  createPost,
  getPostsByUser,
  postById,
  isCreator,
  deletePost,
  updatePost,
  postPhotos,
  getSinglePost,
  like,
  unlike,
  comment,
  uncomment,
  getLastPostByUser,
  uploadImage,
} = require('../controllers/postController');
const {
  createPostValidator,
  validateTimeForPost,
} = require('../validators/postValidator');
const { requireSignin } = require('../controllers/authController');
const { userById } = require('../controllers/userController');

const router = express.Router();

router.get('/posts', getAllPosts);
//like unlike
router.put('/post/like', requireSignin, like);
router.put('/post/unlike', requireSignin, unlike);
//comments
router.put('/post/comment', requireSignin, comment);
router.put('/post/uncomment', requireSignin, uncomment);

router.get('/post/:postId', getSinglePost);
router.post('/post/new/:userId', requireSignin, createPost);
router.get('/posts/by/:userId', getPostsByUser);
router.get('/post/by/:userId', getLastPostByUser);
router.delete('/post/:postId', requireSignin, isCreator, deletePost);
router.put('/post/:postId', requireSignin, isCreator, updatePost);
//cloudinary
router.post('/cloudinary/upload', uploadImage);
//photo
router.get('/post/photos/:postId', postPhotos);

//any route containg :userId, our app will first exec userByID()
router.param('userId', userById);
router.param('postId', postById);

module.exports = router;

const Post = require('../models/postModel');
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');
const cloudinary = require('../utils/cloudinary');

exports.postById = (req, res, next, id) => {
  Post.findById(id)
    .populate('creator', '_id username')
    .populate('comments', 'text created')
    .populate('comments.postedBy', '_id username')
    .exec((err, post) => {
      if (err || !post)
        return res.status('400').json({
          error: 'Post not found',
        });
      req.post = post;
      next();
    });
};

exports.isCreator = (req, res, next) => {
  //   console.log(req.post);
  //   console.log(req.auth);
  //   console.log(req.post.creator._id.toString());
  //   console.log(req.auth._id);
  //   console.log(
  //     req.post && req.auth && req.post.creator._id.toString() === req.auth._id
  //   );

  const isCreator =
    req.post && req.auth && req.post.creator._id == req.auth._id;
  if (!isCreator)
    return res.status(403).json({ error: 'User is not a creator' });
  next();
};

exports.getAllPosts = (req, res) => {
  const posts = Post.find()
    .populate('creator', '_id username')
    // .populate('comments', 'text created')
    // .populate('comments.postedBy', '_id username')
    .select('_id post created photoUrls likes')
    .sort({ created: -1 })
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => console.log(err));
};

exports.createPost = async (req, res, next) => {
  const text = req.body.post;
  const photos = req.body.photos;

  let post = new Post();
  post.post = text;
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  post.creator = req.profile;

  if (photos !== []) {
    for (let index = 0; index < photos.length; index++) {
      const cloudinaryPhoto = await cloudinary.uploader.unsigned_upload(
        photos[index],
        'qgqufopx'
      );
      post.photoUrls.push(cloudinaryPhoto.url);
    }
  }
  if (!post.post) {
    return res.status(400).json({ error: "Post can't be empty" });
  } else if (post.post.length > 365) {
    return res.status(400).json({
      error: 'Post must be less than 365 characters long',
    });
  }
  post.save((err, result) => {
    if (err) return res.status(400).json({ error: err });
    console.log(result);
    res.json(result);
  });
  // });
};

exports.deletePost = (req, res) => {
  let post = req.post;
  post.remove((err, post) => {
    if (err) return res.status(400).json({ error: err });
    res.json({ msg: 'Post delete successfully' });
  });
};

// exports.updatePost = (req, res, next) => {
//   let post = req.post;
//   post = _.extend(post, req.body);
//   post.updated = Date.now();
//   post.save((err, post) => {
//     if (err) return res.status(400).json({ error: err });
//     res.json(post);
//   });
// };

exports.updatePost = async (req, res, next) => {
  let newPhotos = [];
  let post = req.post;
  console.log(post);

  if (req.body.photos) {
    for (let index = 0; index < req.body.photos.length; index++) {
      const cloudinaryPhoto = await cloudinary.uploader.unsigned_upload(
        req.body.photos[index],
        'qgqufopx'
      );
      newPhotos.push(cloudinaryPhoto.url);
    }
    post = _.extend(post, { photoUrls: newPhotos });
  }
  post = _.extend(post, { post: req.body.post });
  if (!post.post) {
    return res.status(400).json({ error: "Post can't be empty" });
  } else if (post.post.length > 365) {
    return res.status(400).json({
      error: 'Post must be less than 365 characters long',
    });
  }
  console.log(post);
  post.save((err, result) => {
    if (err) return res.status(400).json({ error: err });
    console.log(result);
    res.json(result);
  });
};

exports.getPostsByUser = (req, res) => {
  Post.find({ creator: req.profile._id })
    .populate('creator', '_id username')
    .select('_id post created photoUrls likes')
    .sort({ created: -1 })
    .exec((err, posts) => {
      if (err) return res.status(400).json({ error: err });
      res.json(posts);
    });
};

exports.getLastPostByUser = (req, res) => {
  Post.find({ creator: req.profile._id })
    .populate('creator', '_id username')
    .select('_id post created photoUrls likes')
    .sort({ created: -1 })
    .limit(1)
    .exec((err, posts) => {
      if (err) return res.status(400).json({ error: err });
      res.json(posts);
    });
};

exports.postPhotos = (req, res, next) => {
  return res.send(req.post.photoUrls);
};

exports.getSinglePost = (req, res) => {
  console.log(req.post);
  return res.json(req.post);
};

exports.like = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { likes: req.body.userId } },
    { new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({ error: err });
    } else {
      res.json(result);
    }
  });
};

exports.unlike = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { likes: req.body.userId } },
    { new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({ error: err });
    } else {
      res.json(result);
    }
  });
};

exports.comment = (req, res) => {
  let comment = req.body.comment;
  comment.postedBy = req.body.userId;
  console.log('1');

  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { comments: comment } },
    { new: true }
  )
    .populate('comments.postedBy', '_id username')
    .populate('creator', '_id username')
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      } else {
        res.json(result);
      }
    });
};

exports.uncomment = (req, res) => {
  let comment = req.body.comment;

  Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { comments: { _id: comment._id } } },
    { new: true }
  )
    .populate('comments.postedBy', '_id username')
    .populate('creator', '_id username')
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      } else {
        res.json(result);
      }
    });
};

exports.uploadImage = (req, res) => {
  console.log('im here');
  try {
    const fileStr = req.body.data;
    console.log(fileStr);
  } catch (error) {
    console.log(error);
  }
};

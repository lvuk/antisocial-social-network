const Post = require('../models/postModel');
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');

exports.postById = (req, res, next, id) => {
  Post.findById(id)
    .populate('creator', '_id username')
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
    .select('_id post created photo')
    .sort({ created: -1 })
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => console.log(err));
};

exports.createPost = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err)
      return res.status(400).json({ error: 'Image could not be uploaded' });

    let post = new Post(fields);
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    post.creator = req.profile;
    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.filepath);
      post.photo.contentType = files.photo.type;
    }
    if (!post.post) {
      return res.status(400).json({ error: "Post can't be empty" });
    } else if (post.post.length < 4 || post.post.length > 365) {
      return res.status(400).json({
        error: 'Post must be between 4 and 365 characters long',
      });
    }
    post.save((err, result) => {
      if (err) return res.status(400).json({ error: err });
      console.log(result);
      res.json(result);
    });
  });
};

exports.deletePost = (req, res) => {
  let post = req.post;
  post.remove((err, post) => {
    if (err) return res.status(400).json({ error: err });
    res.json({ msg: 'Post delete successfully' });
  });
};

exports.updatePost = (req, res, next) => {
  let post = req.post;
  post = _.extend(post, req.body);
  post.updated = Date.now();
  post.save((err, post) => {
    if (err) return res.status(400).json({ error: err });
    res.json(post);
  });
};

exports.getPostsByUser = (req, res) => {
  Post.find({ creator: req.profile._id })
    .populate('creator', '_id username')
    .sort('_created')
    .exec((err, posts) => {
      if (err) return res.status(400).json({ error: err });
      res.json(posts);
    });
};

exports.postPhoto = (req, res, next) => {
  res.set('Content-Type', req.post.photo.contentType);
  return res.send(req.post.photo.data);
};

exports.getSinglePost = (req, res) => {
  return res.json(req.post);
};

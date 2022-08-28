const Post = require('../models/postModel');

exports.createPostValidator = (req, res, next) => {
  //post
  req.check('post', 'Post cannot be empty').notEmpty();
  req.check('post', 'Post must be between 1 to 365').isLength({
    min: 1,
    max: 365,
  });

  //check for errors
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((err) => err.msg)[0];
    return res.status(400).json({
      error: firstError,
    });
  }

  //next middlewear
  next();
};

exports.validateTimeForPost = (req, res, next) => {
  //get last post
  Post.findOne(
    {
      created: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
    (err, post) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      if (post === null) next();
      else {
        return res
          .status(400)
          .json({ error: 'There must be 24 hours gap between two posts' });
      }
    }
  );
};

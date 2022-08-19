exports.userSignupValidator = (req, res, next) => {
  //username not null & length 4-10
  req.check('username', 'Username is required').notEmpty();
  //email
  req.check('email', 'Email is required').notEmpty();
  req
    .check('email', 'Email must be between 3 to 32 characters')
    .matches(/.+\@.+\..+/)
    .withMessage('Email must contain @')
    .isLength({
      min: 4,
      max: 2000,
    });

  //check password
  req.check('password', 'Password is required').notEmpty();
  req
    .check('password')
    .isLength({ min: 6 })
    .withMessage('Password must contain at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain a number');

  //check errors
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

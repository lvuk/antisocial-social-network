require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const fs = require('fs');
const cors = require('cors');
const app = express();

const postRoutes = require('./routes/postRouter');
const authRoutes = require('./routes/authRouter');
const userRoutes = require('./routes/userRouter');
//api-docs
app.get('/', (req, res) => {
  fs.readFile('api-docs.json', (err, data) => {
    if (err) {
      res.status(400).json({
        error: err,
      });
    }
    const docs = JSON.parse(data);
    res.json(docs);
  });
});

//db config
mongoose.connect(
  'mongodb://localhost:27017/socialNetworkDB',
  { useNewUrlParser: true },
  (err) => {
    if (!err) {
      console.log('Successfully added DB');
    } else {
      console.log(err);
    }
  }
);

//middlewears
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
app.use('/', postRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Unauthorized' });
  } else {
    next(err);
  }
});

app.listen(process.env.PORT, () => {
  console.log('Server successfully started');
});

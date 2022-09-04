const { now } = require('lodash');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
console.log(timezone);

const postSchema = new mongoose.Schema({
  post: {
    type: String,
    required: true,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
  creator: {
    type: ObjectId,
    ref: 'User',
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
  likes: [{ type: ObjectId, ref: 'User' }],
  comments: [
    {
      text: String,
      created: { type: Date, default: Date.now },
      postedBy: { type: ObjectId, ref: 'User' },
    },
  ],
});

module.exports = mongoose.model('Post', postSchema);

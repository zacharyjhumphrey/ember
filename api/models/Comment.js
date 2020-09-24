const mongoose = require('mongoose');

// @note ADD IMAGES TO POSTS
const CommentSchema = mongoose.Schema({
  author: {
    type: mongoose.ObjectId,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.ObjectId,
    required: true
  },
  originalPost: {
    type: mongoose.ObjectId,
    required: true
  },
  upvotes: {
    type: [mongoose.ObjectId],
    default: []
  },
  downvotes: {
    type: [mongoose.ObjectId],
    default: []
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comments', CommentSchema);

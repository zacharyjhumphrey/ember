const mongoose = require('mongoose');

// @note ADD IMAGES TO POSTS
const PostSchema = mongoose.Schema({
  author: {
    type: mongoose.ObjectId,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    required: false
  },
  comments: {
    type: [mongoose.ObjectId],
    default: []
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

module.exports = mongoose.model('Posts', PostSchema);

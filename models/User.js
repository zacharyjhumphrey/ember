const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  posts: {
    type: [mongoose.ObjectId],
    default: []
  },
  comments: {
    type: [mongoose.ObjectId],
    default: []
  },
  upvotedPosts: {
    type: [mongoose.ObjectId],
    default: []
  },
  downvotedPosts: {
    type: [mongoose.ObjectId],
    default: []
  },
  upvotedComments: {
    type: [mongoose.ObjectId],
    default: []
  },
  downvotedComments: {
    type: [mongoose.ObjectId],
    default: []
  },
  timestamp: {
    type: Date,
    default: Date.now
}});

// Middleware for hashing the password
UserSchema.pre('save', async function (next) {
  try {
    // Salt the Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);

    // Save the password
    this.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Users', UserSchema);

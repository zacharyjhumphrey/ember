var express = require('express');
var router = express.Router();
const Comment = require('../models/Comment');
const User = require('../models/User');
const Post = require('../models/Post');

// @test Returns all comments
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    res.json({ message: err });
  }
});

// Find a specific comment
router.get('/:commentId', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    res.json(comment);
  } catch (err) {
    res.json({ message: err });
  }
});

// Create a comment
/*
  req.user (USER MUST BE LOGGED IN)

  originalPost
  body
*/
router.post('/', async (req, res) => {
  try {
    if (!req.user) throw new Error('You must be logged in to do that!');
    
    const user = await User.findById(req.user._id);
    if (user == null) throw new Error('User could not be found');

    const originalPost = await Post.findById(req.body.originalPost);
    if (originalPost == null) throw new Error('Post could not be found');

    const commentData = {
      originalPost: originalPost._id,
      author: user._id,
      body: req.body.body
    }

    const newComment = new Comment(commentData);

    // Add this comment to the list of comments on the post
    originalPost.comments.push(newComment._id);

    // Add this comment to the list of user comments
    user.comments.push(newComment._id);

    // Save ev'rthin'
    const savedComment = await newComment.save();
    const savedPost = await originalPost.save();
    const savedUser = await user.save();

    // Load the data that will be returned to the user
    let returnComment = savedComment.toObject();
    returnComment.author = savedUser.toObject();

    res.json({ comment: returnComment, message: 'Comment has been created', success: true });
  } catch (err) {
    console.log(err.message);
    res.json({ err: err });
  }
});

// @DEBUG
// Update a comment
router.patch('/:commentId', async (req, res) => {
  try {
    const updatedComment = await Comment.updateOne({ _id: req.params.commentId }, {
      $set: req.body
    });
    res.json(updatedComment);
  } catch (err) {
    res.json({ message: err });
  }
});

// Upvote a comment
router.patch('/:commentId/upvote', async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (user == null) throw 'User not found';

    const comment = await Comment.findById(req.params.commentId);
    if (comment == null) throw 'Post not found';

    if (user.upvotedComments.includes(mongoose.Types.ObjectId(comment._id))) throw 'This user has already upvoted this comment';

    // If the user had previously downvoted this comment, remove that downvote
    if (user.downvotedComments.includes(mongoose.Types.ObjectId(comment._id))) {
      // Remove the upvote from the comment
      const userIndex = comment.downvotes.indexOf(mongoose.Types.ObjectId(user._id));
      comment.downvotes.splice(userIndex, 1);

      // Remove the upvote from the user
      const commentIndex = user.downvotedComments.indexOf(mongoose.Types.ObjectId(comment._id));
      user.downvotedComments.splice(commentIndex, 1);
    }

    // Add this user to the list of people that have upvoted this comment
    comment.upvotes.push(mongoose.Types.ObjectId(user._id));
    const savedPost = await comment.save();

    // Add this comment to the list of upvotes for the user
    user.upvotedComments.push(mongoose.Types.ObjectId(comment._id));
    const savedUser = await user.save();

    res.json([comment, user]);
  } catch (err) {
    console.log(err);
    res.json({ message: err });
  }
});

// Remove an upvote on a comment
router.delete('/:commentId/upvote', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (comment == null) throw 'Comment not found';

    const user = await User.findById(req.body.userId);
    if (user == null) throw 'User not found';

    if (!comment.upvotes.includes(mongoose.Types.ObjectId(user._id))) throw 'This user has not upvoted this comment';

    // Remove the user from the list of people that have upvoted this comment in Comment
    const userIndex = comment.upvotes.indexOf(user._id);
    comment.upvotes.splice(userIndex, 1);

    // Remove this comment from the list of comments that
    const commentIndex = user.upvotedComments.indexOf(user._id);
    user.upvotedComments.splice(commentIndex, 1);

    // Save the new user and comment
    await comment.save();
    await user.save();

    res.json([comment, user]);
  } catch (err) {
    console.log(err);
    res.json({ message: err });
  }
});

// Downvote a comment
router.patch('/:commentId/downvote', async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (user == null) throw 'User not found';

    const comment = await Comment.findById(req.params.commentId);
    if (comment == null) throw 'Comment not found';

    if (user.downvotedComments.includes(mongoose.Types.ObjectId(comment._id))) throw 'This user has already downvoted this comment';

    // If the user had previously upvoted this comment, remove that upvote
    if (user.upvotedComments.includes(mongoose.Types.ObjectId(comment._id))) {
      // Remove the upvote from the comment
      const userIndex = comment.upvotes.indexOf(mongoose.Types.ObjectId(user._id));
      comment.upvotes.splice(userIndex, 1);

      // Remove the upvote from the user
      const commentIndex = user.upvotedComments.indexOf(mongoose.Types.ObjectId(comment._id));
      user.upvotedComments.splice(commentIndex, 1);
    }

    // Add this user to the list of people that have downvoted this comment
    comment.downvotes.push(mongoose.Types.ObjectId(user._id));
    await comment.save();

    // Add this comment to the list of downvotes for the user
    user.downvotedComments.push(mongoose.Types.ObjectId(comment._id));
    await user.save();

    res.json([comment, user]);
  } catch (err) {
    console.log(err);
    res.json({ message: err });
  }
});

// Remove a downvote on a comment
router.delete('/:commentId/downvote', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (comment == null) throw 'Comment not found';

    const user = await User.findById(req.body.userId);
    if (user == null) throw 'User not found';

    if (!comment.downvotes.includes(mongoose.Types.ObjectId(user._id))) throw 'This user has not downvoted this comment';

    // Remove the user from the list of people that have downvoted this comment in Comment
    const userIndex = comment.downvotes.indexOf(user._id);
    comment.downvotes.splice(userIndex, 1);

    // Remove this comment from the list of comments that
    const commentIndex = user.downvotedComments.indexOf(user._id);
    user.downvotedComments.splice(commentIndex, 1);

    // Save the new user and comment
    await comment.save();
    await user.save();

    res.json([comment, user]);
  } catch (err) {
    console.log(err);
    res.json({ message: err });
  }
});

// Delete a comment
router.delete('/:commentId', async (req, res) => {
  try {
    const removedComment = await Comment.remove({ _id: req.params.commentId });
    res.json(removedComment);
  } catch (err) {
    res.json({ message: err });
  }
});


module.exports = router;

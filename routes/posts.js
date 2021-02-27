var express = require('express');
var router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const mongoose = require('mongoose');
const async = require('async');
const { getPost } = require('../general-functions.js');

/*
  Returns some posts from the server from oldest to newest

  count: the number of posts that the server will return NOT YET IMPLEMENTED
*/
router.get('/', async (req, res) => {
  // Get all posts
  const postsResults = await Post.find().limit(5).sort({ timestamp: -1 });
  const posts = postsResults.map(post => post.toObject());
  const calls = [];

  // Getting data for the posts
  posts.forEach(post => {
    calls.push(callback => {
      getPost(post).catch(err => callback(err)).then((newPost, err) => {
        callback(err, newPost);
      });
    });
  });

  // Wait for the calls to finish
  async.parallel(calls, (err, result) => {
    if (err) {
      console.error(err);
      res.json(err);
    }

    res.json(result);
  });
});

// Find a specific post
/*
  :postId
*/
router.get('/:postId', async (req, res) => {
  getPost(req.params.postId).then((post) => {
    res.json({ post: post });
  }).catch(err => res.json({ err: err, success: false }))
});

/*
  Precondition: The user must be logged in and have a valid user._id

  Postcondition: Creates a post

  req.user (USER MUST BE LOGGED IN)
  title
  body
*/
router.post('/', async (req, res) => {
  try {
    if (!req.user) throw new Error('You must be logged in to do create a post!');

    const user = await User.findById(req.user._id);
    if (user == null) throw new Error('User not found');

    const postData = {
      author: user._id,
      title: req.body.title,
      body: req.body.body
    }

    // Create the post
    const newPost = new Post(postData);

    // Add this post to the user's list of posts
    user.posts.push(newPost._id);

    // Save
    const savedPost = await newPost.save();
    const savedUser = await user.save();

    getPost(savedPost.toObject()).catch(err => res.json({ err: err, success: true, message: 'Post created, but there was an issue loading it. Try refreshing to see your new post!' })).then((newPost, err) => {
      res.json({ message: 'Post Created!', success: true, data: newPost });
    });
  } catch (err) {
    console.log(err.message);
    res.json({ err: err.message });
  }
});

// Update a post
router.patch('/:postId', async (req, res) => {
  try {
    const updatedPost = await Post.updateOne({ _id: req.params.postId }, {
      $set: req.body
    });
    res.json(updatedPost);
  } catch (err) {
    res.json({ message: err });
  }
});

// Upvote a post
router.patch('/:postId/upvote', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user == null) throw 'User not found';

    const post = await Post.findById(req.params.postId);
    if (post == null) throw 'Post not found';

    if (user.upvotedPosts.includes(mongoose.Types.ObjectId(post._id))) throw 'This user has already upvoted this post';

    // If the user had previously downvoted this comment, remove that downvote
    if (user.downvotedPosts.includes(mongoose.Types.ObjectId(post._id))) {
      // Remove the upvote from the post
      const userIndex = post.downvotes.indexOf(mongoose.Types.ObjectId(user._id));
      post.downvotes.splice(userIndex, 1);

      // Remove the upvote from the user
      const postIndex = user.downvotedPosts.indexOf(mongoose.Types.ObjectId(post._id));
      user.downvotedPosts.splice(postIndex, 1);
    }

    // Add this user to the list of people that have upvoted this post
    post.upvotes.push(mongoose.Types.ObjectId(user._id));
    const savedPost = await post.save();

    // Add this post to the list of upvotes for the user
    user.upvotedPosts.push(mongoose.Types.ObjectId(post._id));
    const savedUser = await user.save();

    res.json([post, user]);
  } catch (err) {
    console.log(err);
    res.json({ message: err });
  }
});

// Remove an upvote on a post
router.delete('/:postId/upvote', async (req, res) => {
  try {
    const post = await Post.findById(req.user._id);
    if (post == null) throw 'Post not found';

    const user = await User.findById(req.body.userId);
    if (user == null) throw 'User not found';

    if (!post.upvotes.includes(mongoose.Types.ObjectId(user._id))) throw 'This user has not upvoted this post';

    // Remove the user from the list of people that have upvoted this post in Post
    const userIndex = post.upvotes.indexOf(user._id);
    post.upvotes.splice(userIndex, 1);

    // Remove this post from the list of posts that
    const postIndex = user.upvotedPosts.indexOf(user._id);
    user.upvotedPosts.splice(postIndex, 1);

    // Save the new user and post
    await post.save();
    await user.save();

    res.json([post, user]);
  } catch (err) {
    console.log(err);
    res.json({ message: err });
  }
});

// Downvote a post
router.patch('/:postId/downvote', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user == null) throw 'User not found';

    const post = await Post.findById(req.params.postId);
    if (post == null) throw 'Post not found';

    if (user.downvotedPosts.includes(mongoose.Types.ObjectId(post._id))) throw 'This user has already downvoted this comment';

    // If the user had previously upvoted this comment, remove that upvote
    if (user.upvotedPosts.includes(mongoose.Types.ObjectId(post._id))) {
      // Remove the upvote from the post
      const userIndex = post.upvotes.indexOf(mongoose.Types.ObjectId(user._id));
      post.upvotes.splice(userIndex, 1);

      // Remove the upvote from the user
      const postIndex = user.upvotedPosts.indexOf(mongoose.Types.ObjectId(post._id));
      user.upvotedPosts.splice(postIndex, 1);
    }

    // Add this user to the list of people that have downvoted this post
    post.downvotes.push(mongoose.Types.ObjectId(user._id));
    await post.save();

    // Add this post to the list of downvotes for the user
    user.downvotedPosts.push(mongoose.Types.ObjectId(post._id));
    await user.save();

    res.json([post, user]);
  } catch (err) {
    console.log(err);
    res.json({ message: err });
  }
});

// Remove a downvote on a post
router.delete('/:postId/downvote', async (req, res) => {
  try {
    const post = await Post.findById(req.user._id);
    if (post == null) throw 'Post not found';

    const user = await User.findById(req.body.userId);
    if (user == null) throw 'User not found';

    if (!post.downvotes.includes(mongoose.Types.ObjectId(user._id))) throw 'This user has not downvoted this post';

    // Remove the user from the list of people that have downvoted this post in Post
    const userIndex = post.downvotes.indexOf(user._id);
    post.downvotes.splice(userIndex, 1);

    // Remove this post from the list of posts that
    const postIndex = user.downvotedPosts.indexOf(user._id);
    user.downvotedPosts.splice(postIndex, 1);

    // Save the new user and post
    await post.save();
    await user.save();

    res.json([post, user]);
  } catch (err) {
    console.log(err);
    res.json({ message: err });
  }
});

// Delete a post
router.delete('/:postId', async (req, res) => {
  try {
    const removedPost = await Post.remove({ _id: req.params.postId });
    res.json(removedPost);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;

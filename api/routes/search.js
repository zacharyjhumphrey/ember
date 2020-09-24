var express = require('express');
var router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const mongoose = require('mongoose');
const { getUser } = require('../general-functions');

// Returns all posts and users
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    const users = await User.find();
    res.json([posts, users]);
  } catch (err) {
    res.json({ message: err });
  }
});

// Finds all authors that have the substring in their name
router.get('/users/:substring', async (req, res) => {
  try {
    const users = await User.find({ username: { $regex: `.*${req.params.substring}.*` } }).limit(5);
    res.json({ users: users });
  } catch (err) {
    res.json({ message: err });
  }
});

// Retrieves author data for the user
router.get('/user/:userId', async (req, res) => {
  getUser(req.params.userId).then((user) => {
    // res.json({ user: user, posts: user.posts });
    res.json(user.posts);
  }).catch(err => console.error(err));
  // try {
  //   const user = await getUser(req.params.userId);


  //   res.json({ user: user });
  // } catch (err) {
  //   res.json({ message: err });
  // }
});

// Returns a user that has the name requested
router.get('/author/:name', async (req, res) => {
  try {
    const user = await User.find({ name: req.params.name });
    res.json(user);
  } catch (err) {
    res.json({ message: err });
  }
});

// Returns a post that has the title requested
router.get('/author/:title', async (req, res) => {
  try {
    // res.json(`Here's what you sent: ${req.params.title}`);
    const post = await Post.find({ title: req.params.title });
    res.json(post);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;

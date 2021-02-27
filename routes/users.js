var express = require('express');
var router = express.Router();
const passport = require('passport');
const User = require('../models/User');
// const { route } = require('./posts');
const { hasAccess } = require('../config/auth');

// Find a specific user
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.json({ message: err });
  }
});

// Get a specific user
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.json(user);
  } catch (err) {
    res.json({ message: err });
  }
});

// Create a user
/*
  email,
  password,
  username
*/
router.post('/', async (req, res) => {
  const newUser = new User(req.body);

  try {
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.json({ message: err });
  }
});

// Update a user
router.patch('/:userId', async (req, res) => {
  try {
    const updatedUser = await User.updateOne({ _id: req.params.userId }, {
      $set: req.body
    });
    res.json(updatedUser);
  } catch (err) {
    res.json({ message: err });
  }
});

// Delete a user
router.delete('/:userId', async (req, res) => {
  try {
    const removedUser = await User.remove({ _id: req.params.userId });
    res.json(removedUser);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;

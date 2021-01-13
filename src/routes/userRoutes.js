const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const user = new User({ email, password, firstName, lastName });
    await user.save();

    const token = jwt.sign({ userId: user._id}, 'MY_SECRET_KEY');
    res.send(token);
  } catch (e) {
    return res.status(422).send(e);
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).send({ error: 'Must provide email and password' });
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(422).send({ error: 'Invalid email or password provided' });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
    res.send({ token });
  } catch (err) {
    return res.status(422).send({ error: 'Invalid password or email' });
  }
});

module.exports = router;

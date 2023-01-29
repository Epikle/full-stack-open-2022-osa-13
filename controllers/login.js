const router = require('express').Router();
const jwt = require('jsonwebtoken');

const { SECRET } = require('../util/config');
const User = require('../models/user');
const Session = require('../models/session');

// /api/login
router.post('/', async (req, res) => {
  const body = req.body;

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  });

  const passwordCorrect = body.password === 'salainen';

  if (!(user && passwordCorrect)) {
    throw new Error('invalid credentials');
  }

  if (!user.isActive) throw new Error('user disabled');

  const { id, username, name } = user;

  const userForToken = {
    username,
    id,
  };

  const token = jwt.sign(userForToken, SECRET);

  await Session.upsert({
    userId: id,
    token,
  });

  res.status(200).json({ token, username, name });
});

module.exports = router;

const router = require('express').Router();

const { User, Blog } = require('../models');

// /api/users
router.get('/', async (_req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  });

  res.json(users);
});

router.post('/', async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

router.put('/:username', async (req, res) => {
  const { username } = req.params;
  const { name } = req.body;

  if (!name || name.trim() === 0) throw new Error('Invalid input');

  const user = await User.findOne({
    where: {
      username,
    },
  });

  if (user) {
    user.name = name;
    await user.save();

    return res.json(user);
  }

  res.sendStatus(404);
});

module.exports = router;

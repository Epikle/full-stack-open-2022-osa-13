const router = require('express').Router();
const { Op } = require('sequelize');
const { tokenExtractor } = require('../middlewares');

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

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { read } = req.query;
  let where = {};

  if (read) {
    if (read !== 'true' && read !== 'false') {
      throw new Error('Invalid input');
    }

    where = {
      read,
    };
  }

  const user = await User.findByPk(id, {
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId'] },
        through: {
          attributes: ['read', 'id'],
          where,
        },
      },
    ],
  });

  res.json(user);
});

router.post('/', async (req, res) => {
  const user = await User.create(req.body);

  res.json(user);
});

router.put('/:username', tokenExtractor, async (req, res) => {
  const { username } = req.params;
  const { name } = req.body;

  if (!name || name.trim() === 0) throw new Error('Invalid input');

  const user = await User.findOne({
    where: {
      username,
    },
  });

  if (user && req.decodedToken.id === user.id) {
    user.name = name;
    await user.save();

    return res.json(user);
  }

  res.sendStatus(404);
});

module.exports = router;

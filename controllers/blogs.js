const router = require('express').Router();
const { Op } = require('sequelize');

const { Blog, User } = require('../models');
const { tokenExtractor } = require('../middlewares');

// /api/blogs/
const blogFinder = async (req, _res, next) => {
  const { id } = req.params;
  req.blog = await Blog.findByPk(id);
  next();
};

router.get('/', async (req, res) => {
  let where = {};
  const { search } = req.query;

  if (search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          author: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ],
    };
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    order: [['likes', 'DESC']],
    include: {
      model: User,
    },
    where,
  });

  res.json(blogs);
});

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    return res.json(req.blog);
  }

  res.sendStatus(404);
});

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.create({ ...req.body, userId: user.id });
  return res.json(blog);
});

router.put('/:id', blogFinder, async (req, res) => {
  const { blog } = req;

  if (blog) {
    blog.likes++;
    await blog.save();
    return res.status(200).json({ likes: blog.likes });
  }

  res.sendStatus(404);
});

router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
  if (req.blog && req.decodedToken.id === req.blog.userId) {
    await req.blog.destroy();
  }

  res.sendStatus(200);
});

module.exports = router;

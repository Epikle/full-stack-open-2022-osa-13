const router = require('express').Router();

const { Blog } = require('../models');

// /api/blogs/

const blogFinder = async (req, _res, next) => {
  const { id } = req.params;
  req.blog = await Blog.findByPk(id);
  next();
};

router.get('/', async (_req, res) => {
  const blogs = await Blog.findAll();

  res.json(blogs);
});

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    return res.json(req.blog);
  }

  res.sendStatus(404);
});

router.post('/', async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    return res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
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

router.delete('/:id', blogFinder, async (req, res) => {
  if (req.blog) await req.blog.destroy();

  res.sendStatus(200);
});

module.exports = router;

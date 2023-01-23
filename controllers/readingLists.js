const router = require('express').Router();

const { ReadingList } = require('../models');

// /api/readinglists
router.post('/', async (req, res) => {
  console.log(req.body);
  const read = await ReadingList.create(req.body);

  res.status(200).json(read);
});

module.exports = router;

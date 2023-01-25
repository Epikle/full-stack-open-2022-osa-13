const router = require('express').Router();

const { ReadingList } = require('../models');
const { tokenExtractor } = require('../middlewares');

// /api/readinglists
router.post('/', async (req, res) => {
  const read = await ReadingList.create(req.body);

  res.status(200).json(read);
});

router.put('/:id', tokenExtractor, async (req, res) => {
  const { id } = req.params;
  const { read } = req.body;

  if (read === undefined) throw new Error('Invalid input');

  const reading = await ReadingList.findByPk(id);

  if (req.decodedToken.id !== reading.userId) {
    throw new Error('invalid credentials');
  }

  if (reading) {
    reading.read = read;
    await reading.save();
    return res.status(200).json(reading);
  }

  res.sendStatus(404);
});

module.exports = router;

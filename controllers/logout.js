const router = require('express').Router();

const { tokenExtractor } = require('../middlewares');
const Session = require('../models/session');

// /api/logout
router.delete('/', tokenExtractor, async (req, res) => {
  const userSession = await Session.findByPk(req.decodedToken.id);

  if (userSession) {
    await userSession.destroy();
    return res.sendStatus(200);
  }

  res.sendStatus(404);
});

module.exports = router;

const jwt = require('jsonwebtoken');

const { User } = require('./models');
const Session = require('./models/session');
const { SECRET } = require('./util/config');

const notFound = (_req, res) => {
  res.sendStatus(404);
};

const errorHandler = (error, _req, res, _next) => {
  console.error(error.message);

  if (error.message.startsWith('Invalid input')) {
    return res.status(400).json({ error: 'invalid input' });
  } else if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'token invalid' });
  } else if (error.message.startsWith('token missing')) {
    return res.status(401).json({ error: 'token missing' });
  } else if (error.message.startsWith('invalid credentials')) {
    return res.status(401).json({ error: 'invalid credentials' });
  } else if (error.message.startsWith('user disabled')) {
    return res.status(403).json({ error: 'user blocked' });
  } else if (error.message.startsWith('old token')) {
    return res.status(403).json({ error: 'token invalid' });
  }

  res.sendStatus(500);
};

const tokenExtractor = async (req, _res, next) => {
  const authorization = req.get('authorization');

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7);
    console.log(token);
    req.decodedToken = jwt.verify(token, SECRET);

    const user = await User.findByPk(req.decodedToken.id);
    if (!user.isActive) throw new Error('user disabled');
    const session = await Session.findByPk(req.decodedToken.id);
    if (session?.token !== token) throw new Error('old token');
  } else {
    throw new Error('token missing');
  }

  next();
};

module.exports = { notFound, errorHandler, tokenExtractor };

const jwt = require('jsonwebtoken');

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
  }

  res.sendStatus(500);
};

const tokenExtractor = (req, _res, next) => {
  const authorization = req.get('authorization');

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    console.log(authorization.substring(7));
    req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
  } else {
    throw new Error('token missing');
  }

  next();
};

module.exports = { notFound, errorHandler, tokenExtractor };

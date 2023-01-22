const express = require('express');
require('express-async-errors');

const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

const app = express();

app.use(express.json());

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use((_req, res) => {
  res.sendStatus(404);
});

app.use((error, _req, res, _next) => {
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
});

(async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();

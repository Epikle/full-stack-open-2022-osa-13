const express = require('express');
require('express-async-errors');

const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');

const blogsRouter = require('./controllers/blogs');

const app = express();

app.use(express.json());

app.use('/api/blogs', blogsRouter);

app.use((_req, res) => {
  res.sendStatus(404);
});

app.use((error, _req, res, _next) => {
  console.error(error.message);

  res.sendStatus(500);
});

(async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();

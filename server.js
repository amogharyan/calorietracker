// load environment variables from .env
require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// parse JSON bodies
app.use(express.json());

// serve static files from /public
app.use(express.static('public'));

// mount menus route
app.use('/api/menus', require('./routes/menus'));

// start the server
app.listen(PORT, () =>
{
  console.log(`server listening on http://localhost:${PORT}`);
});
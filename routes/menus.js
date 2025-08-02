const express = require('express');
const router = express.Router();

// GET /api/menus/sync
router.get('/sync', (req, res) =>
{
  res.json({ message: 'menu sync route is working' });
});

module.exports = router;
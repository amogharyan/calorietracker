// backend/routes/menuRoutes.js
import express from "express";

const router = express.Router();

// GET /api/menus/sync
router.get('/sync', (req, res) => {
  res.json({ message: 'menu sync route is working' });
});

export default router;
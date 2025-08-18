import express from "express";

const router = express.Router();

router.get('/sync', (req, res) => 
{
  res.json({ message: 'menu sync route is working' });
});

export default router;
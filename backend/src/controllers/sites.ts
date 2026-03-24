import { Router } from 'express';

const router = Router();

// TODO: Implement sites controller
// GET /api/sites
router.get('/', (req, res) => {
  res.json({ message: 'Sites controller - TODO' });
});

export default router;

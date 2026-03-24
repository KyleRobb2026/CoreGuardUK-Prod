import { Router } from 'express';

const router = Router();

// TODO: Implement compliance controller
router.get('/', (req, res) => {
  res.json({ message: 'Compliance controller - TODO' });
});

export default router;

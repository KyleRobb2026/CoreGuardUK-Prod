import { Router } from 'express';

const router = Router();

// TODO: Implement check calls controller
router.get('/', (req, res) => {
  res.json({ message: 'Check calls controller - TODO' });
});

export default router;

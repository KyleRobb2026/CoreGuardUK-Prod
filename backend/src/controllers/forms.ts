import { Router } from 'express';

const router = Router();

// TODO: Implement forms controller
router.get('/', (req, res) => {
  res.json({ message: 'Forms controller - TODO' });
});

export default router;

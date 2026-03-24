import { Router } from 'express';

const router = Router();

// TODO: Implement audit controller
router.get('/', (req, res) => {
  res.json({ message: 'Audit controller - TODO' });
});

export default router;

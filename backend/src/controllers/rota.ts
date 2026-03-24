import { Router } from 'express';

const router = Router();

// TODO: Implement rota controller
router.get('/', (req, res) => {
  res.json({ message: 'Rota controller - TODO' });
});

export default router;

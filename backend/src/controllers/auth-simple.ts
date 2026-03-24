import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

// Simple auth endpoints for Railway deployment
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // TODO: Implement actual authentication
    // For now, return a mock token
    const token = jwt.sign(
      { id: '1', email, actor_type: 'admin', organisation_id: '1' },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: '1',
        email,
        first_name: 'Admin',
        last_name: 'User',
        actor_type: 'admin',
        organisation_id: '1',
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, first_name, last_name, organisation_name } = req.body;
    
    // TODO: Implement actual registration
    const token = jwt.sign(
      { id: '1', email, actor_type: 'admin', organisation_id: '1' },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: '1',
        email,
        first_name,
        last_name,
        actor_type: 'admin',
        organisation_id: '1',
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', async (req: Request, res: Response) => {
  try {
    // TODO: Implement actual user lookup
    res.json({
      user: {
        id: '1',
        email: 'admin@example.com',
        first_name: 'Admin',
        last_name: 'User',
        actor_type: 'admin',
        organisation_id: '1',
        is_active: true,
        created_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

export default router;

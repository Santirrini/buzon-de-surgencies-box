import express, { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { ADMIN_PASSWORD } from '../server'; // Import from server.ts

const router = Router();

// JWT Secret - store this securely, e.g., in environment variables.
const JWT_SECRET = "your-super-secret-and-long-enough-jwt-secret-key";

// POST /api/auth/login
router.post('/login', (req: Request, res: Response) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  if (password === ADMIN_PASSWORD) {
    const payload = { userId: 'admin-user', role: 'admin' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  } else {
    return res.status(401).json({ message: 'Invalid password' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req: Request, res: Response) => {
  res.status(204).send(); // No Content
});

export default router;

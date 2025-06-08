import { Request, Response } from 'express';
import { loginUser } from '../services/auth.service';

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const token = await loginUser(username, password);
    res.status(200).json({ token });
  } catch (error: any) {
    if (error.message === 'Invalid credentials' || error.message === 'JWT_SECRET is not defined in environment variables.') {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}

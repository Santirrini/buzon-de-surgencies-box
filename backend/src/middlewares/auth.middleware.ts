import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, verify } from 'jsonwebtoken';

interface UserPayload extends JwtPayload {
  userId: string;
  username: string;
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Access token is required and must be a Bearer token' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error('JWT_SECRET is not defined in environment variables.');
    res.status(500).json({ message: 'JWT secret not configured on server' });
    return;
  }

  verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }

    req.user = decoded as UserPayload;
    next();
  });
}

import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, verify } from 'jsonwebtoken';

interface UserPayload extends JwtPayload {
  userId: string;
  username: string;
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access token is required and must be a Bearer token' });
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error('JWT_SECRET is not defined in environment variables.');
    return res.status(500).json({ message: 'JWT secret not configured on server' });
  }

  verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.user = decoded as UserPayload;
    next();
  });
}

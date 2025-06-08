import { JwtPayload } from 'jsonwebtoken';

// Define your UserPayload structure matching the one in auth.middleware.ts
export interface UserPayload extends JwtPayload {
  userId: string;
  username: string;
  // Add other properties if they are in your JWT payload
}

declare global {
  namespace Express {
    export interface Request {
      user?: UserPayload; // Make user optional as it's only present after middleware
    }
  }
}

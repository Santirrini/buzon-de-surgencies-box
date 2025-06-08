// This file is for global Express Request augmentation
import { UserPayload } from '../user.types'; // Adjusted path

declare global {
  namespace Express {
    export interface Request {
      user?: UserPayload;
    }
  }
}

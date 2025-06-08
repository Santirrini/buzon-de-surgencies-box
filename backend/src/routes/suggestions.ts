import express, { Request, Response, Router, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Suggestion, SuggestionStatus } from '../types';
import { suggestionsStore } from '../server'; // Import from server.ts

const router = Router();

const JWT_SECRET = "your-super-secret-and-long-enough-jwt-secret-key";

interface AuthenticatedRequest extends Request {
  user?: any;
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

router.get('/public', (req: Request, res: Response) => {
  const approvedSuggestions = suggestionsStore.filter(s => s.status === SuggestionStatus.APPROVED);
  res.json(approvedSuggestions);
});

router.post('/', (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ message: 'Suggestion text is required and must be a non-empty string.' });
  }
  const newSuggestion: Suggestion = {
    id: crypto.randomUUID(),
    text: text.trim(),
    status: SuggestionStatus.PENDING,
    submittedAt: Date.now(),
  };
  suggestionsStore.push(newSuggestion); // Modifies the imported suggestionsStore
  res.status(201).json(newSuggestion);
});

router.get('/admin', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  res.json(suggestionsStore);
});

router.put('/admin/:id/approve', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const suggestion = suggestionsStore.find(s => s.id === id); // find instead of findIndex for direct object reference

  if (!suggestion) {
    return res.status(404).json({ message: 'Suggestion not found.' });
  }
  suggestion.status = SuggestionStatus.APPROVED;
  res.json(suggestion);
});

router.delete('/admin/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const suggestionIndex = suggestionsStore.findIndex(s => s.id === id);

  if (suggestionIndex === -1) {
    return res.status(404).json({ message: 'Suggestion not found.' });
  }
  suggestionsStore.splice(suggestionIndex, 1); // Use splice to modify the imported array
  res.status(204).send();
});

export default router;

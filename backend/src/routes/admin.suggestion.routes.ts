import { Router } from 'express';
import { fetchAllSuggestions, approveExistingSuggestion, removeSuggestion } from '../controllers/admin.suggestion.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', fetchAllSuggestions);
router.put('/:id/approve', approveExistingSuggestion);
router.delete('/:id', removeSuggestion);

export default router;

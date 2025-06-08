import { Router, RequestHandler } from 'express';
import { fetchAllSuggestions, approveExistingSuggestion, removeSuggestion } from '../controllers/admin.suggestion.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateToken);

const typedFetchAllSuggestionsHandler: RequestHandler = fetchAllSuggestions;
const typedApproveExistingSuggestionHandler: RequestHandler = approveExistingSuggestion;
const typedRemoveSuggestionHandler: RequestHandler = removeSuggestion;

router.get('/', typedFetchAllSuggestionsHandler);
router.put('/:id/approve', typedApproveExistingSuggestionHandler);
router.delete('/:id', typedRemoveSuggestionHandler);

export default router;

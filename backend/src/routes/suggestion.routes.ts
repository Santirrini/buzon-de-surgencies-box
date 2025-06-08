import { Router, RequestHandler } from 'express';
import { getAllApprovedSuggestions, postSuggestion } from '../controllers/suggestion.controller';

const router = Router();

const typedGetAllApprovedSuggestionsHandler: RequestHandler = getAllApprovedSuggestions;
const typedPostSuggestionHandler: RequestHandler = postSuggestion;

router.get('/', typedGetAllApprovedSuggestionsHandler);
router.post('/', typedPostSuggestionHandler);

export default router;

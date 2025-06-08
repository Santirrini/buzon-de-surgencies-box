import { Router } from 'express';
import { getAllApprovedSuggestions, postSuggestion } from '../controllers/suggestion.controller';

const router = Router();

router.get('/', getAllApprovedSuggestions);
router.post('/', postSuggestion);

export default router;

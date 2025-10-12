import { Router } from 'express';
import { createPoll, getAllPolls, getPoll, castVote } from '../controllers/pollController';

const router = Router();

router.post('/', createPoll);
router.get('/', getAllPolls); // Get all polls for homepage
router.get('/:slug', getPoll);
router.post('/:slug/vote', castVote);

export default router;

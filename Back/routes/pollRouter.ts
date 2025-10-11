import { Router } from 'express';
import { createPoll, getPoll, castVote } from '../controllers/pollController';

const router = Router();

router.post('/', createPoll);
router.get('/:slug', getPoll);
router.post('/:slug/vote', castVote);

export default router;

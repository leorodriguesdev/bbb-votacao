const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');

router.get('/votes/total', voteController.getTotalVotes);
router.get('/votes/participante/:name', voteController.getVotesByParticipant);
router.post('/vote', voteController.postVote);
router.get('/votes/hourly/:name', voteController.getHourlyVotes);
router.get('/votes/history', voteController.getVotesHistory);

module.exports = router;

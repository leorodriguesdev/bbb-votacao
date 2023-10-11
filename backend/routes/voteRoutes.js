const express = require('express');
const router = express.Router();
const voteControllerWithWss = require('../controllers/voteController');

const voteController = voteControllerWithWss(require('../websocket').wss);

router.get('/votes/total', voteController.getTotalVotes);
router.get('/votes/participante/:name', voteController.getVotesByParticipant);
router.post('/vote', voteController.postVote);
router.get('/votes/hourly/:name', voteController.getHourlyVotes);
router.get('/votes/history', voteController.getVotesHistory);

module.exports = router;

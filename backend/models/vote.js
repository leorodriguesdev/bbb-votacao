const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    participante: String,
    hour: Number
});

const Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;
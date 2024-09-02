// models/vote.js

const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    id_card_num: {
        type: String,
        required: true,
        unique: true // Ensure a voter can only vote once using their ID card number
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Vote', voteSchema);

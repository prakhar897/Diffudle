var mongoose = require('mongoose');

const Question = mongoose.model('question', new mongoose.Schema({
	name: String,
    image: String,
    style: String,
    attemptNumber: String,
    date: String
}));

module.exports = Question
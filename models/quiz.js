const mongoose = require('mongoose');

const quiz = mongoose.Schema({
	data: {
		type: mongoose.Schema.Types.Mixed,
	},
	quiz_id: {
		type: String,
	},
	created_at: {
		type: Date, default: Date.now()
	},
	updated_at: {
		type: Date, default: Date.now()
	},
});

module.exports = mongoose.model('quiz', quiz);
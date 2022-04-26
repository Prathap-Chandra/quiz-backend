const mongoose = require('mongoose');

const logs = mongoose.Schema({
	quiz_id: {
		type: String,
	},
	username: {
		type: String
	},
	score: {
		type: String
	},
	created_at: {
		type: Date, default: Date.now()
	},
});

module.exports = mongoose.model('logs', logs);
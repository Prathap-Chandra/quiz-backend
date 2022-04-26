const PORT = process.env.PORT || 8642;
const assert = require('assert');
const mongoose = require('mongoose');
const express = require('express');
const { v4: uuid } = require('uuid');
const config = require('./config.js');
const fs = require('fs');
const app = express();

// exports models to query
const Quiz = require('./models/quiz');
const Logs = require('./models/logs');

// Connect to MongoDB
mongoose
	.connect(config.mongoURI, config.mongoOpts)
	.then(() => {
		console.log('MongoDB Connected');
	})
	.catch(err => {
		console.log(err);
	});


app.use(express.json());

/* Route for testing */
app.get('/', (req, res) => {
	return res.status(200).json({
		message: 'Welcome to quiz backend',
		success: true,
		status: 'OK'
	})
});

/* 
Frontend will send the text file content as string. 
We process it, store it in db and send the quiz id along with formated quiz content
so that the frontend can send us the id back when sending user details and we map and store in db accordingly
*/
app.post('/quiz-content', async (req, res) => {
	try {
		const toReturn = { success: false, data: [] };
		let { content } = req.body;
		// assert(content, 'content should be present');

		// if (typeof content !== 'string') {
		// 	throw new Error('invalid content type');
		// }

		content = fs.readFileSync('/Users/prathap/Downloads/codebase/quiz-backend/questions.txt', 'utf8');
		content = content.split('\n');
		console.log(content);

		for (let i = 0; i < content.length; i++) {
			while (content[i] !== '@QUESTION' || content[i] === '') { i++; }

			const singleQuestion = {};
			if (content[i] === '@QUESTION') {
				i++;
				singleQuestion.question = content[i];
			}

			// answer
			while (content[i] !== '@ANSWER' || content[i] === '') { i++; };
			if (content[i] === '@ANSWER') {
				i++;
				singleQuestion.answer = [content[i]];
			}

			// options
			singleQuestion.options = [];
			while (content[i] === '\n') { i++; }
			// options 1
			i++;
			singleQuestion.options.push(content[i]);
			// options 2
			i++;
			singleQuestion.options.push(content[i]);
			// options 3
			i++;
			singleQuestion.options.push(content[i]);
			// options 4
			i++;
			singleQuestion.options.push(content[i]);

			console.log(singleQuestion);
			toReturn.data.push(singleQuestion);

			if (i != content.length - 1) {
				continue;
			}
		}

		if (toReturn.data.length) {
			const quiz_id = uuid().toString();
			const newQuiz = new Quiz({
				_id: new mongoose.Types.ObjectId(),
				data: toReturn.data,
				quiz_id,
			}, { collection: "quiz" });

			await newQuiz.save();
			toReturn.quiz_id = quiz_id;
			toReturn.success = true;
		}

		return res.status(200).json(toReturn);
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
});

/* 
User will click on fetch logs button to check the whole history 
NOTE: Pagination is needed if data is heavy
*/
app.get('/logs', async (req, res) => {
	try {
		const userLogs = await Logs.find({});
		return res.status(500).json(userLogs);
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
})

/* 
Once test is completed. FE will make request to store logs in DB
*/
app.post('/logs', async (req, res) => {
	try {
		const { quiz_id, username, score } = req.body || {};
		const toReturn = { success: true, status: 'OK' };

		const userLogs = new Logs({
			_id: new mongoose.Types.ObjectId(),
			quiz_id, username, score
		}, { collection: "logs" });

		await userLogs.save();

		return res.status(200).json(toReturn);
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
})

app.use((req, res, next) => {
	const error = new Error("The requested URL is not found");
	error.status = 404;
	next(error);
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
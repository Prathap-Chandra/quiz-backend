const express = require('express');
const app = express();
const PORT = process.env.PORT || 8642;

app.use(express.json());

app.get('/home', (req, res) => {
	return res.status(200).json({
		route: '/home',
		success: true,
		status: 'OK'
	})
});

app.get('/home', (req, res) => {
	return res.status(200).json({
		route: '/',
		success: true,
		status: 'OK'
	})
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
const express = require('express');
const app = express();
const PORT = 6000;

app.use(express.json());

app.get('/home', (req, res) => {
	return res.status(200).json({
		success: true,
		status: 'OK'
	})
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
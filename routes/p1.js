

module.exports = function(app){

	let express = require('express');
	let route = express.Router();

	route.get('/r1', (req, res) => {
		res.send('Hello /p1/r1');
	});

	route.get('/r2', (req, res) => {
		res.send('Hello /p1/r2');
	});

	return route;
};

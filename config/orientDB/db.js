module.exports = function(){
	/* orientDB */
	let oriento 	= require('orientjs');
	/* orientDB  */
	let server = oriento({
		host: 'localhost',
		port: 2424,
		username: 'root',
		password: 'Ksm73009662@'
	});
	let db = server.use('02');

	return db;
};
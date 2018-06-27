let oriento = require('orientjs');

let server = oriento({
	host: 'localhost',
	port: 2424,
	username: 'root',
	password: 'Ksm73009662@'
});

let db = server.use('02');

// db.record.get('#34:0')
// 	.then(function (record) {
// 		console.log('Loaded record:', record);
// 	});

/*
// CREATE
let sql = 'select from topic';
db.query(sql).then((results) => {
	console.log(results);
});
*/
/*

let sql = 'select from topic where @rid=:rid';
let param = {params:
				{	rid: '#34:0'}
			};
db.query(sql, param).then((results) => {
	console.log(results);
});
*/

/*

//insert
let sql = 'insert into topic(title, description) values(:title, :desc)';
let param = {
	params : {
		title: 'Express',
		desc: 'Express is framework for web'
	}
};

db.query(sql, param).then( (results) => {
	console.log(results);
});
*/

/*

//update
let sql = 'update topic set title=:title where @rid=:rid';
db.query(sql, {params : { title : 'Expressjs', rid:'#35:0'}}).then( (results) => {
	console.log(results); // return => update된 recode 갯수
});
*/

let sql = 'delete from topic where @rid=:rid';

db.query(sql, { params:{rid : '#35:0' } }).then( (results) => {
	console.log(results); // return => delete된 recode 갯수
});

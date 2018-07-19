let route = require('express').Router();

/* db */
let db = require('../../config/orientDB/db')();

/* 암호화 */
let bkfd2Password = require("pbkdf2-password");
let hasher = bkfd2Password();

module.exports = function(passport){

	// login 폼
	route.get('/login', (req, res) => {
		let sql = 'select from topic';
		db.query(sql).then( (topics) => {
			res.render('auth/login', { topics : topics, user : req.user })
		});
	});

	// login 정책 - passport.js
	route.post('/login',
		passport.authenticate('local', {
			successRedirect: '/topic',
			failureRedirect: '/login',
			failureFlash: false
			// failureFlash: 'Invalid username or password.'
		})
	);

	// login facebook
	route.get('/facebook', passport.authenticate('facebook', { scope: 'email' }));

	// login facebook - callback - 페이스북 인증시 페이스북에서 호출되는 url
	route.get('/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect: '/topic',
			failureRedirect: '/login'
		}));

	// register 폼
	route.get('/register', (req, res) => {
		let sql = 'select from topic';
		db.query(sql).then( (topics) => {
			res.render('auth/register', { topics : topics })
		});
	});

	// register process
	route.post('/register', (req, res) => {

		let uname		= req.body.username;
		let pwd 		= req.body.password;
		let displayName	= req.body.displayName;

		return hasher({password : pwd}, (err, pass, salt, hash) => {

			let sql = 'insert into user (authId, username, password, salt, displayName) ' +
				'values(:authId, :username, :password, :salt, :displayName)';

			db.query(sql, {
				params: {
					authId: `local:${uname}`,
					username: uname,
					password: hash,
					salt: salt,
					displayName: displayName
				}
			}).then( (results) =>{

				//passportjs 방식
				req.login(results[0], (err) => {
					req.session.save( () => {
						res.redirect('/topic');
					})
				});

			}, (err) => {
				console.log(err);
				res.status(500);	//내부에러
			});

		});
	});

	// logout
	route.get('/logout', (req, res) => {
		req.logout(); //passportjs 방식
		req.session.save( ()=> res.redirect('/topic'));
	});

	return route;
};
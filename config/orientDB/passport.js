/* 암호화*/
let bkfd2Password = require("pbkdf2-password");
let hasher = bkfd2Password();

/* 타사인증 */
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let FacebookStrategy = require('passport-facebook').Strategy;

/* db */
let db = require('./db')();

module.exports = function(app){

	/* 타사인증 */
	app.use(passport.initialize());
	app.use(passport.session());	// *주의* : line 18 - session을 정의한 후 선언해야함.

	//passport 방식으로 로그인변경
	passport.serializeUser(function(user, done) {
		console.log('serializeUser', user);
		done(null, user.authId);
	});

	passport.deserializeUser(function(id, done) {
		console.log('deserializeUser', id);

		let sql = `select * from user where authId=:authId`;

		db.query(sql, { params : { authId : id } }).then( (results) => {

			if(results.length === 0) 	return done('There is no user.');
			else 						return done(null, results[0]);

		}, (err) => {
			console.log(err);
			return done(null, false);
		});
	});


	// local 인증 정책
	passport.use(new LocalStrategy(
		(username, password, done) => {

			let uname 	= username;
			let pwd 	= password;

			let sql = 'select * from user where authId=:authId';

			db.query(sql, {params: {authId: `local:${uname}`}}).then( (results) => {

				if(results.length === 0)	return done(null, false);

				let user = results[0];

				return hasher({password:pwd, salt:user.salt }, (err, pass, salt, hash) => {
					if(hash === user.password)
						done(null, user);
					else
						done(null, false);
				});

			});
		}
	));

	// 타사인증 - facebook
	passport.use(new FacebookStrategy({
			clientID: '196298951224770',
			clientSecret: '30b2c4a16f668dc1b78be15c1ff17b66',
			callbackURL: "/auth/facebook/callback",
			profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name'
				, 'timezone', 'updated_time', 'verified', 'displayName'] //User Profile - http://www.passportjs.org/docs/profile/ - 타사사이트별로 제공해주는 scope를 찾아봐야함
		},
		function(accessToken, refreshToken, profile, done) {
			// console.log("accessToken", accessToken);
			// console.log("refreshToken", refreshToken);
			// console.log("profile", profile);

			let userInfo = {
				authId: `facebook:${profile.id}`,
				username: profile.displayName,
				displayName: profile.displayName,
				email: profile.emails[0].value
			};

			// user select
			let sqlSelect = 'select * from user where authId=:authId';
			db.query(sqlSelect, {params: {authId: userInfo.authId}}).then((results) => {

				if(results.length !== 0)	return done(null, results[0]);
				else{
					// user insert
					let sqlInsert = 'insert into user (authId, displayName, username,  email) ' +
						'values(:authId, :displayName, :username, :email)';

					db.query(sqlInsert, {
						params: userInfo
					}).then((results) => {

						if(results.length === 0) return done(null, false);
						else					 return done(null, results[0])

					}, (err) => {
						console.log(err);
						return done(null, false);
					});
				}
			}).then((err) => {
				if(err){
					console.log(err);
					return done(null, false);
				}
			});
		}
	));

	return passport;
};
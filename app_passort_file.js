let express = require('express');
let session = require('express-session');	//기본적으로 메모리에 정을를 메모리에 저장한다.
let FileStore = require('session-file-store')(session);
let bodyParser = require('body-parser');
let flash = require('connect-flash');
let cookieParser = require('cookie-parser');

/*암호화*/
let md5 = require('md5');
let sha256 = require('sha256');
let bkfd2Password = require("pbkdf2-password");
let hasher = bkfd2Password();

/* 타사인증 */
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let FacebookStrategy = require('passport-facebook').Strategy;


let app = express();

app.use(session({
	secret: 'dsfasfsdafdsf',  //salt
	resave: false,
	saveUninitialized: true,
	store: new FileStore()
}));

app.use(bodyParser.urlencoded({ extended: false }));

/*타사인증*/
app.use(passport.initialize());
app.use(passport.session());	// *주의* : line 18 - session을 정의한 후 선언해야함.

/* 플래쉬 */
app.use(cookieParser('Ksm73009662@'));
app.use(flash());

let user = [
	{
		authId: 'local:seonmo',
		name : 'seonmo',
		pwd : 'VwJco5SpZBvhxiR15O7YJlnMAfolEd2Ean/g5Tx+ayTN/yR63DZCevrQSsVl3LD8j0J4E+2PQMrkTTDJzzpTF0uMOfmRf0KmjNXFp1yGtysSjOEFj6RTz7on7awuF/DSfiHvOcpvD0qUGd+Nu76Aq7zAXbEy/2QQ0d4VqXmJoXQ=',
		salt :'SvspbIPOk2biR0//El1mXqHVjaR1+e7YRT8BYEjP1e9C9AJ9KYzsgCSx4KC3QGUPK6lwB7TAp32UYGKjf5id59gDsicG1GLtYQdRA====',
		displayName : 'momochung'
	}
	// {
	// 	authId: 2,
	// 	name : 'k8805',
	// 	pwd : '4e7a5a4d30ad2f4e83c85699c3075b8154d662c75b23e6a6950dd717ef8a08f5',
	// 	salt : 'asdfcx213213ds',
	// 	displayName : 'K5'
	// }
];

//login 폼
app.get('/auth/login', (req, res) => {
	req.flash();

	let output = `
		<form action="/auth/login" method="post">
		<p>
			<input type="text" name="username" placeholder="username">
		</p>
		<p>
			<input type="password" name="password" placeholder="password">
		</p>
		<p>
			<input type="submit">
		</p>
		</form>
		<a href="/auth/facebook">facebook</a>
	`;
	res.send(`<h1>Login</h1> ${output}` );
});

// 타사인증 - facebook
passport.use(new FacebookStrategy({
		clientID: '196298951224770',
		clientSecret: '30b2c4a16f668dc1b78be15c1ff17b66',
		callbackURL: "/auth/facebook/callback",
		profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName'] //User Profile - http://www.passportjs.org/docs/profile/ - 타사사이트별로 제공해주는 scope를 찾아봐야함
	},
	function(accessToken, refreshToken, profile, done) {
		// console.log("accessToken", accessToken);
		// console.log("refreshToken", refreshToken);
		console.log("profile", profile);

		let authId = `facebook:${profile.id}`;

		for(let i=0; i<user.length; i++){
			let userInfo = user[i];

			if(userInfo.authId === 'authId')
				return done(null, userInfo);
		}

		let newUser = {
			'authId': authId,
			'displayName': profile.displayName,
			'email': profile.emails[0].value
		};

		user.push(newUser);

		done(null, newUser );

		// User.findOrCreate(..., function(err, user) {
		// 	if (err) { return done(err); }
		// 	done(null, user);
		// });
	}
));

app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

app.get('/auth/facebook/callback',
	passport.authenticate('facebook', {
		successRedirect: '/welcome',
		failureRedirect: '/auth/login'
	}));


//passport 방식으로 로그인변경
passport.serializeUser(function(user, done) {
	console.log('serializeUser', user);
	done(null, user.authId);
});

passport.deserializeUser(function(id, done) {
	console.log('deserializeUser', id);

	for(let i = 0; i < user.length; i++) {
		let userInfo = user[i];

		if(userInfo.authId === id){
			return done(null, userInfo);
		}
	}
	done('There is no User.')
});

passport.use(new LocalStrategy(
	(username, password, done) => {

		// if(err) done(err);

		let uname 	= username;
		let pwd 	= password;

		for(let i = 0; i < user.length; i++)
		{
			let userInfo = user[i];

			if(userInfo.name === uname )
			{
				return hasher({password:pwd, salt:userInfo.salt }, (err, pass, salt, hash) => {
					if(hash === userInfo.pwd)
					{
						// console.log('LocalStrategy', user);
						done(null, userInfo);
					}
					else
					{
						done(null, false, {message : "Incorrect password."});
					}
				});
			}
		}

		done(null, false, { message: 'Incorrect username' });
	}
));

app.post('/auth/login',
			passport.authenticate('local', {
												successRedirect: '/welcome',
												failureRedirect: '/auth/login',
												failureFlash: true
												// failureFlash: 'Invalid username or password.'
											})
		);


/*

app.post('/auth/login', (req, res) => {

	let uname = req.body.username;
	let pwd = req.body.password;

	for(let i = 0; i < user.length; i++)
	{
		let userInfo = user[i];

		if(userInfo.name === uname )
		{
			return hasher({password:pwd, salt:userInfo.salt }, (err, pass, salt, hash) => {
				if(hash === userInfo.pwd)

				{
					req.session.displayName = userInfo.displayName;
					req.session.save(() => res.redirect('/welcome'));
				}
			});
		}

		/!*let userInfo = user[i];
		console.log(userInfo.name,'   ', uname);
		console.log(userInfo.pwd,'   ',  sha256(pwd+userInfo.salt));

		if(userInfo.name === uname && userInfo.pwd === sha256(pwd+userInfo.salt) )
		{
			req.session.displayName = userInfo.displayName;
			req.session.save(() => res.redirect('/welcome'));
		}*!/
	}

	res.send(`Who are you? <a href="/auth/login">login</a>`);
});
*/

//register 폼
app.get('/auth/register', (req, res) => {

	let output = `
		<form action="/auth/register" method="post">
		<p>
			<input type="text" name="username" placeholder="username">
		</p>
		<p>
			<input type="password" name="password" placeholder="password">
		</p>
		<p>
			<input type="text" name="displayName" placeholder="displayName">
		</p>
		<p>
			<input type="submit">
		</p>
		</form>
	`;
	res.send(`<h1>Login</h1> ${output}`);
});

app.post('/auth/register', (req, res) => {

	let uname		= req.body.username;
	let pwd 		= req.body.password;
	let displayName	= req.body.displayName;

	return hasher({password : pwd}, (err, pass, salt, hash) => {

		let userInfo = {
			authId 		: `local:${uname}`,
			name 		: uname,
			pwd 		: hash,
			salt 		: salt,
			displayName : displayName
		};

		user.push(userInfo);

		//passportjs 방식
		req.login(userInfo, (err) => {
			req.session.save( () => {
				res.redirect('/welcome');
			})
		});
		/*
		req.session.displayName = displayName;
		req.session.save( () => {
			res.redirect('/welcome');
		})
		*/
	});
});

app.get('/welcome', (req, res) => {

	// if(req.session.displayName)
	if(req.user && req.user.displayName)	//passport js
		res.send(`
			<h1>Hello, ${req.user.displayName}</h1>
			<a href="/auth/logout">logout</a>
		`);
	else
		res.send(`
			<h1>Welcome</h1>
			<ul>
				<li><a href="/auth/login">Login</a></li>
				<li><a href="/auth/register">Register</a></li>
			</ul>
		`);
});

app.get('/auth/logout', (req, res) => {
	req.logout(); //passportjs 방식
	req.session.save( ()=> res.redirect('/welcome'));
	/*	
	if(	req.session.displayName){
		delete req.session.displayName;
		req.session.save( ()=> res.redirect('/welcome'));
	}
	else
		res.redirect('/auth/login');
	*/
});

app.get('/count', (req, res) => {
	if(req.session.count)	req.session.count++;
	else					req.session.count = 1;
	res.send(`count : ${req.session.count}`);
});

/*
app.get('/tmp', (req, res) => {
	res.send(`result : ${req.session.count}`);
});
*/


app.listen(3003, (req, res)=> {
	console.log('Connected 3003 port')
});
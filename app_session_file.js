let express = require('express');
let session = require('express-session');	//기본적으로 메모리에 정을를 메모리에 저장한다.
let FileStore = require('session-file-store')(session);
let bodyParser = require('body-parser');
let md5 = require('md5');
let sha256 = require('sha256');
let bkfd2Password = require("pbkdf2-password");
let hasher = bkfd2Password();

let app = express();


app.use(session({
	secret: 'dsfasfsdafdsf',  //salt
	resave: false,
	saveUninitialized: true,
	store: new FileStore
}));
app.use(bodyParser.urlencoded({ extended: false }));

let user = [
	{
		name : 'seonmo',
		pwd : 'VwJco5SpZBvhxiR15O7YJlnMAfolEd2Ean/g5Tx+ayTN/yR63DZCevrQSsVl3LD8j0J4E+2PQMrkTTDJzzpTF0uMOfmRf0KmjNXFp1yGtysSjOEFj6RTz7on7awuF/DSfiHvOcpvD0qUGd+Nu76Aq7zAXbEy/2QQ0d4VqXmJoXQ=',
		salt :'SvspbIPOk2biR0//El1mXqHVjaR1+e7YRT8BYEjP1e9C9AJ9KYzsgCSx4KC3QGUPK6lwB7TAp32UYGKjf5id59gDsicG1GLtYQdRA====',
		displayName : 'momochung'
	},
	{
		name : 'k8805',
		pwd : '4e7a5a4d30ad2f4e83c85699c3075b8154d662c75b23e6a6950dd717ef8a08f5',
		salt : 'asdfcx213213ds',
		displayName : 'K5'
	}
];

//login 폼
app.get('/auth/login', (req, res) => {
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
	`;
	res.send(`<h1>Login</h1> ${output}`);
});

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

		/*let userInfo = user[i];
		console.log(userInfo.name,'   ', uname);
		console.log(userInfo.pwd,'   ',  sha256(pwd+userInfo.salt));

		if(userInfo.name === uname && userInfo.pwd === sha256(pwd+userInfo.salt) )
		{
			req.session.displayName = userInfo.displayName;
			req.session.save(() => res.redirect('/welcome'));
		}*/
	}

	res.send(`Who are you? <a href="/auth/login">login</a>`);
});

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
		user.push({
			name 		: uname,
			pwd 		: hash,
			salt 		: salt,
			displayName : displayName
		});

		req.session.displayName = displayName;
		req.session.save( () => {
			res.redirect('/welcome');
		})
	});
});

app.get('/welcome', (req, res) => {

	console.log(user);
	if(req.session.displayName)
		res.send(`
			<h1>Hello, ${req.session.displayName}</h1>
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
	if(	req.session.displayName){
		delete req.session.displayName;
		req.session.save( ()=> res.redirect('/welcome'));
	}
	else
		res.redirect('/auth/login');

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
let express = require('express');
let session = require('express-session');	//기본적으로 메모리에 정을를 메모리에 저장한다.
let bodyParser = require('body-parser');
let app = express();

app.use(session({
	secret: 'dsfasfsdafdsf',  //solt
	resave: false,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: false }));

let user = {
	name : 'seonmo',
	pwd : '111',
	displayName : 'momochung'
};

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

	if(user.name === uname && user.pwd === pwd)
	{
		req.session.displayName = user.displayName;
		res.redirect('/welcome');
	}
	else
		res.send(`Who are you? <a href="/auth/login">login</a>`);
});

app.get('/welcome', (req, res) => {

	if(req.session.displayName)
		res.send(`
			<h1>Hello, ${req.session.displayName}</h1>
			<a href="/auth/logout">logout</a>
		`);
	else
		res.send(`
			<h1>Welcome</h1>
			<a href="/auth/login">Login</a>
		`);
});

app.get('/auth/logout', (req, res) => {
	if(	req.session.displayName){
		delete req.session.displayName;
		res.redirect('/welcome');
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
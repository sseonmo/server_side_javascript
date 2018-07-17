let app = require('./config/orientDB/express')();

/* 인증 */
let passport = require('./config/orientDB/passport')(app);

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

let auth = require('./routes/orientDB/auth')(passport);
app.use('/auth', auth);

app.listen(3003, (req, res)=> {
	console.log('Connected 3003 port')
});


/* sample
app.get('/count', (req, res) => {
	if(req.session.count)	req.session.count++;
	else					req.session.count = 1;
	res.send(`count : ${req.session.count}`);
});


app.get('/tmp', (req, res) => {
	res.send(`result : ${req.session.count}`);
});
*/

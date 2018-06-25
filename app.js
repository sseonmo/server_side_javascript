let express = require('express');
let bodyParser = require('body-parser');

let app = express();

app.locals.pretty = true;
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));	//정적파일 디렉토리 위치지정

// parse application/x-www-form-urlencoded
 app.use(bodyParser.urlencoded({ extended: false }));
// create application/x-www-form-urlencoded parser
// let urlencodedParser = bodyParser.urlencoded({ extended: false });	// content-Type 를 여러개 받을때 변수를 사용할면 될것 같음


app.get('/form', (req, res) => {
	res.render('form')
});

app.post('/form_reciver', (req, res) => {

	let title = req.body.title;
	let desc = req.body.description;

	res.send(title+'@@'+desc);
});

// semantic url 방식
app.get('/topic/:id', (req, res) => {

	let topics = [
		'Javascript is...',
		'Nodejs is ...',
		'Express is ...'
	];

	let as = `
		<a href="/topic/0" >Javascript</a><br>
		<a href="/topic/1" >Nodejs</a><br>
		<a href="/topic/2" >Express</a><br>
	`;

	let template = `
		${as}
		<h1>
			${topics[req.params.id]}
		</h1>
	`;

	res.send(template);
});

app.get('/topic/:id/:mode', (req, res) => {
	console.log(req.params);
	res.send(req.params.id+"@"+req.params.mode);

});

/* querystring 방식
app.get('/topic', (req, res) => {

	let topics = [
		'Javascript is...',
		'Nodejs is ...',
		'Express is ...'
	];

	let as = `
		<a href="/topic?id=0" >Javascript</a><br>
		<a href="/topic?id=1" >Nodejs</a><br>
		<a href="/topic?id=2" >Express</a><br>
	`;

	let template = `
		${as}
		<h1>
			${topics[req.query.id]}
		</h1>
	`;

	res.send(template);
});*/

app.get('/template', (req, res) =>{
	let time = new Date();
	res.render('temp', {time : time, _title : 'hello Pug'})
});

app.get('/', function (req, res) {
	res.send('Welcome to NodeJs');
});

app.get('/dynamic', function (req, res) {

	let lis = "";

	for(let i = 0; i < 5; i++){
		lis += "<li>coding</li>"
	}

	let time = new Date();

	res.send(`<!DOCUTYPE html>
				<html>
					<head>
						<meta charset="utf-8">
						<title></title>
					</head>
					<body>
						Hello, Dynamic
						<ul>
							${lis}
						</ul>
						<div>${time}</div>
					</body>
				</html>`);
});

app.get('/router', function (req, res) {
	res.send('Hello Rouger, <img src="/map.png" />');
});

app.get('/login', function (req, res) {
	res.send('Login please');
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});

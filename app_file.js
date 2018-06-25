let express = require('express');
let fs = require('fs');
let bodyParser = require('body-parser');

let app = express();
app.locals.pretty = true;			// 이쁘게..ㅋㅋㅋ

app.set('views', './views_file');	// 템플릿 디렉토리 위치
app.set('view engine', 'pug');		// pug 를 사용하겠다.

app.use(bodyParser.urlencoded({ extended: false }));

/* body-parse 다른 사용방법
// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
*/

app.get('/topic/new', (req, res) => {
	res.render('new');
});

app.post('/topic', (req, res) => {

	let title = req.body.title;
	let desc = req.body.description;

	fs.writeFile(`./data/${title}`, desc, 'utf8', (err) => {

		if(Boolean(err)){
			console.log(err);
			res.status(500).send('Internal Server Error'); //500 표시 - server error
		}

		res.send(title);
	})

});


app.listen(3000, (req, res) =>{
	console.log('Connect 3000 port');


});


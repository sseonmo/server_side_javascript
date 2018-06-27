let express 	= require('express');
let fs 			= require('fs');
let bodyParser 	= require('body-parser');
let oriento 	= require('orientjs');

let app = express();
app.locals.pretty = true;			// 이쁘게..ㅋㅋㅋ

app.set('views', './views_orientDB');	// 템플릿 디렉토리 위치
app.set('view engine', 'pug');			// pug 를 사용하겠다.

app.use(bodyParser.urlencoded({ extended: false }));

/* body-parse 다른 사용방법
// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
*/

//orientDB config
let server = oriento({
	host: 'localhost',
	port: 2424,
	username: 'root',
	password: 'Ksm73009662@'
});
let db = server.use('02');



// 등록 폼
app.get('/topic_new', (req, res) => {

	fs.readdir('./data', 'utf8', (err, files) => {

		if (err) {
			// throw err;
			console.log(err);
			res.status(500).send('Internal Server Error'); //500 표시 - server error
		}
		res.render('new', { fileArr : files}) ;
	});

});


//목록조회
app.get(['/topic/', '/topic/:id'], (req, res) =>{

	let id = req.params.id;

	let sql = 'select from topic';

	if(id)
	{
		db.query(sql).then( (topics) => {

			sql += ' where @rid=:rid';

			db.query(sql, {params:{ rid : decodeURIComponent(id)}}).then( (topicInfo) => {
				res.render('view', { topics : topics, title : topicInfo[0].title, desc : topicInfo[0].description }) ;
			});
		});
	}
	else
	{
		db.query(sql).then( (results) => {

			res.render('view', { topics : results, title : 'Welcome', desc : 'Hello, Javascript for server' }) ;
		});
	}
/*
	fs.readdir('./data', 'utf8', (err, files) => {

		if (err) {
			// throw err;
			console.log(err);
			res.status(500).send('Internal Server Error'); //500 표시 - server error
		}


		if(Boolean(id))
		{
			fs.readFile(`data/${id}`, 'utf8', (err, data) => {

				if (err){
					// throw err;
					console.log(err);
					res.status(500).send('Internal Server Error'); //500 표시 - server error
				}
				res.render('view', { fileArr : files, title : id, desc : data }) ;
			})
		}
		else
		{
			res.render('view', { fileArr : files, title : 'Welcome', desc : 'Hello, Javascript for server' }) ;
		}
	});*/

});

/*
// 목록조회
app.get('/topic', (req, res) => {

	fs.readdir('./data', 'utf8', (err, data) => {
		if (err){
			// throw err;
			console.log(err);
			res.status(500).send('Internal Server Error'); //500 표시 - server error
		}

		res.render('view', { fileArr : data}) ;
	});
});

//상세조회
app.get('/topic/:id', (req, res) => {

	let id = req.params.id;

	fs.readdir('./data', 'utf8', (err, files) => {
		if (err){
			// throw err;
			console.log(err);
			res.status(500).send('Internal Server Error'); //500 표시 - server error
		}

		fs.readFile(`data/${id}`, 'utf8', (err, data) => {

			if (err){
				// throw err;
				console.log(err);
				res.status(500).send('Internal Server Error'); //500 표시 - server error
			}

			res.render('view', { fileArr : files, title : id, desc : data }) ;
		})
	});
});
*/

// 등록
app.post('/topic', (req, res) => {

	let title = req.body.title;
	let desc = req.body.description;

	fs.writeFile(`./data/${title}`, desc, 'utf8', (err) => {

		if(Boolean(err)){
			console.log(err);
			res.status(500).send('Internal Server Error'); //500 표시 - server error
		}


		res.redirect(`/topic/${title}`);
	})
});


app.listen(3000, (req, res) =>{
	console.log('Connect 3000 port');

});


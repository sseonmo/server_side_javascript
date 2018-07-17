let express 	= require('express');
let fs 			= require('fs');
let bodyParser 	= require('body-parser');
let oriento 	= require('orientjs');

let app = express();
app.locals.pretty = true;			// 이쁘게..ㅋㅋㅋ

app.set('views', './views/orientDB/');	// 템플릿 디렉토리 위치
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
app.get('/topic/add', (req, res) => {

	let sql = 'select from topic';

	db.query(sql).then( (topics) => {

		if(topics.length === 0)
			res.status(500).send('Internal Server Error');
		else
			res.render('topic/add', { topics : topics}) ;
	});

});


// 등록
app.post('/topic/add', (req, res) => {

	let title = req.body.title;
	let desc = req.body.description;
	let author = req.body.author;

	let sql = 'insert into topic(title, description, author	) values(:title, :description, :author)';

	db.query(sql, { params : { title : title, description : desc, author : author} }).then( (result) => {

		if(result.lenth === 0)
			res.status(500).send('Internal Server Error'); //500 표시 - server error
		else
			 res.redirect(`/topic/${encodeURIComponent(result[0]['@rid'])}`)
	});

});

//수정폼
app.get('/topic/:id/edit', (req, res) => {

	let id = decodeURIComponent(req.params.id);
	let sql = 'select from topic';

	db.query(sql).then( (topics) => {

		sql += ' where @rid=:rid';

		db.query(sql, {params:{ rid : id }}).then( (topicInfo) => {
			res.render('topic/edit', {
				topics 		: topics,
				topicInfo	: topicInfo[0]
			}) ;
		});
	});
});

// 수정
app.post('/topic/:id/edit', (req, res) => {

	let id		= req.params.id;
	let title 	= req.body.title;
	let desc 	= req.body.description;
	let author 	= req.body.author;

	let sql = 'update topic set title=:title, description=:description, author=:author where @rid=:rid';
		console.log('before : ',id);

	db.query(sql, { params : { title : title, description : desc, author : author, rid : id } }).then( (result) => {
		res.redirect(`/topic/${encodeURIComponent(id)}`)
	});

});


//삭제폼
app.get('/topic/:id/delete', (req, res) => {

	let id = req.params.id;
	let sql = 'select from topic';

	db.query(sql).then( (topics) => {

		sql += ' where @rid=:rid';

		db.query(sql, {params:{ rid : id }}).then( (topicInfo) => {
			res.render('topic/delete', {
				topics 		: topics,
				topicInfo	: topicInfo[0]
			}) ;
		});
	});

});

//삭제
app.post('/topic/:id/delete', (req, res) => {

	let id	= req.params.id;
	let sql = 'delete from  topic where @rid=:rid';
	console.log('before : ',id);

	db.query(sql, { params : { rid : id } }).then( (topic) => {
		res.redirect('/topic')
	});

});


//목록조회
app.get(['/topic/', '/topic/:id'], (req, res) =>{

	console.log('/topic/', '/topic/:id');
	let id = req.params.id;

	let sql = 'select from topic';

	if(id)
	{
		db.query(sql).then( (topics) => {

			sql += ' where @rid=:rid';

			db.query(sql, {params:{ rid : id}}).then( (topicInfo) => {
				res.render('topic/view', {
					topics 	: topics,
					title 	: topicInfo[0].title,
					desc 	: topicInfo[0].description,
					author 	: topicInfo[0].author,
					dRid 	: encodeURIComponent(topicInfo[0]['@rid'])
				}) ;
			});
		});
	}
	else
	{
		db.query(sql).then( (results) => {
			res.render('topic/view', { topics : results, title : 'Welcome', desc : 'Hello, Javascript for server' }) ;
		});
	}

});


app.listen(3000, (req, res) =>{
	console.log('Connect 3000 port');
});
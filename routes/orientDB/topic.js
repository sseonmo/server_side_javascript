

module.exports = function(){

	let route = require('express').Router();

	/* db */
	let db = require('../../config/orientDB/db')();

	// 등록 폼
	route.get('/add', (req, res) => {

		let sql = 'select from topic';

		db.query(sql).then( (topics) => {

			if(topics.length === 0)
				res.status(500).send('Internal Server Error');
			else
				res.render('topic/add', { topics : topics, user	: req.user}) ;
		});

	});


// 등록
	route.post('/add', (req, res) => {

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
	route.get('/:id/edit', (req, res) => {

		let id = decodeURIComponent(req.params.id);
		let sql = 'select from topic';

		db.query(sql).then( (topics) => {

			sql += ' where @rid=:rid';

			db.query(sql, {params:{ rid : id }}).then( (topicInfo) => {
				res.render('topic/edit', {
					topics 		: topics,
					topicInfo	: topicInfo[0],
					user		: req.user
				}) ;
			});
		});
	});

// 수정
	route.post('/:id/edit', (req, res) => {

		let id		= req.params.id;
		let title 	= req.body.title;
		let desc 	= req.body.description;
		let author 	= req.body.author;

		let sql = 'update topic set title=:title, description=:description, author=:author where @rid=:rid';

		db.query(sql, { params : { title : title, description : desc, author : author, rid : id } }).then( (result) => {
			res.redirect(`/topic/${encodeURIComponent(id)}`)
		});

	});


//삭제폼
	route.get('/:id/delete', (req, res) => {

		let id = req.params.id;
		let sql = 'select from topic';

		db.query(sql).then( (topics) => {

			sql += ' where @rid=:rid';

			db.query(sql, {params:{ rid : id }}).then( (topicInfo) => {
				res.render('topic/delete', {
					topics 		: topics,
					topicInfo	: topicInfo[0],
					user		: req.user
				}) ;
			});
		});

	});

//삭제
	route.post('/:id/delete', (req, res) => {

		let id	= req.params.id;
		let sql = 'delete from  topic where @rid=:rid';

		db.query(sql, { params : { rid : id } }).then( (topic) => {
			res.redirect('/topic')
		});

	});


//목록조회
	route.get(['/', '/:id'], (req, res) =>{

		let id = req.params.id;

		let sql = 'select from topic';

		if(id)
		{
			db.query(sql).then( (topics) => {

				sql += ' where @rid=:rid';

				db.query(sql, {params:{ rid : id}}).then( (topicInfo) => {
					res.render('topic/view', {
						topics 	: topics,
						topic 	: topicInfo[0],
						user	: req.user
					}) ;
				});
			});
		}
		else
		{
			db.query(sql).then( (results) => {
				res.render('topic/view', { topics : results, title : 'Welcome', desc : 'Hello, Javascript for server', user : req.user }) ;
			});
		}

	});



	return route;
};
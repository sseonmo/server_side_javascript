let express = require('express');
let app = express();
app.locals.pretty = true;			// 이쁘게..ㅋㅋㅋ

app.set('view engine', 'pug');
app.set('views', 'pug');

app.get('/view', (req, res) =>{
	res.render('view');
});

app.get('/add', (req, res) =>{
	res.render('add');
});

app.listen(3003, () => {
	console.log('Connect 3003 port')
});

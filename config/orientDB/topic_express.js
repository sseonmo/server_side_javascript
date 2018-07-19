module.exports = () => {

	let express 	= require('express');
	let bodyParser 	= require('body-parser');

	let app = express();

	app.locals.pretty = true;			// 이쁘게..ㅋㅋㅋ

	app.set('views', './views/orientDB/');	// 템플릿 디렉토리 위치
	app.set('view engine', 'pug');			// pug 를 사용하겠다.

	app.use(bodyParser.urlencoded({ extended: false }));

	return app;
};

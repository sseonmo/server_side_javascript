module.exports = function(){

	let express 		= require('express');
	let session 		= require('express-session');	//기본적으로 메모리에 정을를 메모리에 저장한다.
	let orientoStore 	= require('connect-oriento')(session);
	let bodyParser 		= require('body-parser');

	/* app */
	let app = express();

	/* pug 셋팅 */
	app.set('views', './views/orientDB');	// 템플릿 디렉토리 위치
	app.set('view engine', 'pug');			// pug 를 사용하겠다.

	/* body parse */
	app.use(bodyParser.urlencoded({ extended: false }));

	/* session */
	app.use(session({
		secret: 'dsfasfsdafdsf',  //salt
		resave: false,
		saveUninitialized: true,
		store: new orientoStore({
			server: "host=localhost&port=2424&username=root&password=Ksm73009662@&db=02"
		})
	}));

	return app;
};
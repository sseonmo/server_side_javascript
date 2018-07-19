

/* express */
let app = require('./config/orientDB/express')();

/* 인증 */
let passport = require('./config/orientDB/passport')(app);

/* db */
let db = require('./config/orientDB/db')();

let auth = require('./routes/orientDB/auth')(passport);
app.use('/auth', auth);

let route = require('./routes/orientDB/topic')();
app.use('/topic', route);

app.listen(3000, (req, res) =>{
	console.log('Connect 3000 port');
});
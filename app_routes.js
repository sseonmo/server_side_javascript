let express = require('express');
let app = express();

let p1 = require('./routes/p1')(app);
app.use('/p1', p1);

let p2 = require('./routes/p2')(app);
app.use('/p2', p2);

app.listen(3003, (req, res) => {
	console.log('connected 3003 port');
});
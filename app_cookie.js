let express = require('express');
let cookieParser = require('cookie-parser');

let app = express();
app.use(cookieParser('Ksm73009662@'));

let products = {
	1 : {title : 'The History of web 1'},
	2 : {title : 'The next web'}
};

//product 목록
app.get('/products', (req, res) => {

	let output = '';
	for(let name  in products){
		output += `
				<li>
					<a href="/cart/${name}"> ${products[name].title} </a>
				</li>
				`;
	}

	res.send(`<h1>Products</h1><ul>${output}</ul><a href="/cart">Cart</a>`)
});

//cookie 에 product 저장
app.get('/cart/:id', (req, res) => {
	console.log('/cart/:id');
	let id = req.params.id;
	let cart = {};

	if(req.signedCookies.cart)	cart = req.signedCookies.cart;	// cookie 암호화
	// if(req.cookies.cart)	cart = req.cookies.cart;

	cart[id] = parseInt(cart[id] || '0') + 1;
	res.cookie('cart', cart, {signed : true});	//cookie 암호화
	// res.cookie('cart', cart);

	res.redirect('/cart');
});

//cookie 에 product 삭제
app.get('/cart/delete/:id', (req, res) => {
	// console.log('/cart/delete/:id');
	let id = req.params.id;
	let cart = req.signedCookies.cart;	//cookie 암호화
	// let cart = req.cookies.cart;

	if(cart[id] === 1)	delete cart[id];
	else				cart[id] = cart[id] -1;

	res.cookie('cart', cart, {signed : true});	//cookie 암호화
	// res.cookie('cart', cart);
	res.redirect('/cart');
});

//cart page
app.get('/cart', (req, res) => {

	let cart = req.signedCookies.cart;	//cookie 암호화
	// let cart = req.cookies.cart;
	let output = '';

	if(!cart) res.send('Empty Cart');

	for(let id in cart){
		output += `
			<li>
				${products[id].title} : ${cart[id]} (<a href="/cart/delete/${id}">Delete</a>)
			</li>
		`;
	}
	res.send(`	<H1>Cart</H1>
				<ul>${output}</ul>
				<a href="/products">Products List</a> `);
});


//cookie sample
app.get('/cookie', (req, res) => {
	let count = parseInt( req.signedCookies.count || '0' );	// cookie 암호화
	// let count = parseInt( req.cookies.count || '0' );
	console.log(count);

	count += 1;
	res.cookie('count', count, {signed : true});	// cookie 암호화
	// res.cookie('count', count);
	res.send('count : '+count);
});

app.listen(3003, (req, res)=> {
	console.log('Connected 3003 port')
});

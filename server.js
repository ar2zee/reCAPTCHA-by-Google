const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html')
});

app.post('/subscribe', (req,res) => {
	if(
		req.body.captcha === undefined ||
		req.body.captcha === '' ||
		req.body.captcha === null 
	) {
		return res.json({'success': false, "msg": "Please Select Captcha"})
	}
	// Secret Key
	const secretKey = '6LfO2z8UAAAAAKwC_6wzGv6qVUK1kCGItYcMpgZz';

	// Verify URL
	const verifyURL = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

	// Make Request to Make Verify URL
	request(verifyURL, (err, response, body) => {
		body = JSON.parse(body);
		console.log(body)
		// if not successful
		if(body.success !== undefined && !body.success) {
			return res.json({'success': false, "msg": "Failed capthca verification"});
		}

		// if successful
		return res.json({'success': true, "msg": "Captcha Passed"})
	})
})

app.listen(3000, () => {
	console.log('Port started on port 3000')
})
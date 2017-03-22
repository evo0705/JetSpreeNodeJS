'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _config = require('./../config');

var _config2 = _interopRequireDefault(_config);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var saltRounds = 10;

var router = _express2.default.Router();

router.post('/signup', function (req, res) {

	if (req.body.email == undefined || req.body.password == undefined || req.body.email == '' || req.body.password == '') {
		return res.json({ success: false, message: "Email and Password are required." });
	} else {

		// check password mininum length
		if (req.body.password.length < 6) return res.json({ success: false, message: "Password too short." });

		req.pool.connect().then(function (client) {

			// check if email already exists
			client.query('SELECT email FROM users WHERE email=$1', [req.body.email]).then(function (result) {
				if (result.rowCount >= 1) return res.json({ success: false, message: "This email has already been taken." });
			}).catch(function (e) {
				client.release();
				throw e;
			});

			// encrypt password
			_bcrypt2.default.hash(req.body.password, saltRounds).then(function (hash) {

				// create new user record
				client.query('INSERT INTO users(email, password) VALUES($1, $2)', [req.body.email, hash]).then(function (result) {
					client.release();
					if (result.rowCount == 1) return res.json({ success: true });else return res.json({ success: false });
					console.log("already res.json");
				}).catch(function (e) {
					client.release();
					throw e;
				});
			}).catch(function (err) {
				throw err;
			});
		});
	}
}).post('/authenticate', function (req, res) {
	req.pool.connect().then(function (client) {

		// find the user
		client.query('SELECT id,email FROM users WHERE email=$1 LIMIT 1', [req.body.email]).then(function (result) {
			client.release();

			// user not found
			if (result.rows.length < 1) {
				return res.json({ success: false, message: 'Authentication failed.' });
			} else {
				var user = result.rows[0];

				_bcrypt2.default.compare(req.body.password, user.password).then(function (match) {

					// wrong password
					if (!match) {
						return res.json({ success: false, message: 'Authentication failed.' });
					} else {

						// create a token
						var token = _jsonwebtoken2.default.sign(user, _config2.default.secret, {
							expiresIn: _config2.default.token_duration
						});

						// return the token information
						return res.json({
							success: true,
							token: token,
							expiresIn: _config2.default.token_duration
						});
					}
				});
			}
		}).catch(function (e) {
			client.release();
			throw e;
		});
	});
})

//authenticated by passport
.get('/authenticated', function (req, res) {
	if (req.isAuthenticated()) {
		// create a token
		var token = _jsonwebtoken2.default.sign(req.user, _config2.default.secret, {
			expiresIn: _config2.default.token_duration
		});

		// return the token information
		return res.json({
			success: true,
			token: token,
			expiresIn: _config2.default.token_duration
		});
	} else {
		return res.json({ success: false, message: "Authentication failed." });
	}
});

/*
.post('/token', function (req, res) {
	
	var originalDecoded = jwt.decode(req.body.token, {complete: true});
	var refreshed = jwt.refresh(originalDecoded, config.token_duration, config.secret);
	
	// return the new token information
	res.json({
		success: true,
		token: refreshed,
		expiresIn: config.token_duration
	});
})
*/

;

module.exports = router;
//# sourceMappingURL=login.js.map
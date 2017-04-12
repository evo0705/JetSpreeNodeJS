"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _config = require("./../config");

var _config2 = _interopRequireDefault(_config);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _bcrypt = require("bcrypt");

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _schemas = require("../schemas");

var _schemas2 = _interopRequireDefault(_schemas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var saltRounds = 10;

var router = _express2.default.Router();

router.post('/signup', function (req, res) {

	req.checkBody(_schemas2.default.signup);
	var errors = req.validationErrors();

	if (errors) {
		return res.json({ success: false, errors: errors });
	}

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
			client.query('INSERT INTO users(email, password) VALUES($1, $2) RETURNING id,email', [req.body.email, hash]).then(function (result) {
				client.release();
                if (result.rowCount === 1) {
					// create a token
					var token = _jsonwebtoken2.default.sign({
						id: result.rows[0].id,
						email: result.rows[0].email
					}, _config2.default.secret, {
						expiresIn: _config2.default.token_duration
					});

					// return the token information
					return res.json({
						success: true,
						token: token,
						expiresIn: _config2.default.token_duration
					});
				} else return res.json({ success: false });
			}).catch(function (e) {
				client.release();
				throw e;
			});
		}).catch(function (err) {
			throw err;
		});
	});
}).post('/account', function (req, res) {
	req.pool.connect().then(function (client) {

		// find the user
		client.query('SELECT * FROM users WHERE email=$1 LIMIT 1', [req.body.email]).then(function (result) {
			client.release();

			// user not found
			if (result.rows.length < 1) {
				return res.json({ success: false, message: 'Authentication failed.' });
            } else if (result.rows[0].password === null) {
				return res.json({ success: false, message: 'Authentication failed.' });
			} else {
				var user = result.rows[0];

				_bcrypt2.default.compare(req.body.password, user.password).then(function (match) {

					// wrong password
					if (!match) {
						return res.json({ success: false, message: 'Authentication failed.' });
					} else {

						// create a token
						var token = _jsonwebtoken2.default.sign({
							id: user.id,
							email: user.email
						}, _config2.default.secret, {
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

exports.default = router;
//# sourceMappingURL=login.js.map

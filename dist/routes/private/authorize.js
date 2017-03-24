'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _config = require('./../../config');

var _config2 = _interopRequireDefault(_config);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.use(function (req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {

		// verifies secret and checks exp
		_jsonwebtoken2.default.verify(token, _config2.default.secret, function (err, decoded) {
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });
			} else {

				// save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});
	} else {

		// there is no token
		return res.status(403).send({
			success: false,
			message: 'No valid token provided.'
		});
	}
});

module.exports = router;
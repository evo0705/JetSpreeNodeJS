'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _schemas = require('../schemas');

var _schemas2 = _interopRequireDefault(_schemas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router

/* GET list of Countries */
.get('/', function (req, res) {
	req.pool.connect().then(function (client) {
		client.query('SELECT * FROM countries').then(function (result) {
			client.release();
			return res.json({ success: true, result: result.rows });
		}).catch(function (err) {
			client.release();
			throw err;
			return res.json({ success: false, error: err });
		});
	});
}).get("/img", function (req, res) {
	var s3 = new req.aws.S3({ params: { Bucket: 'jetspree' } });
	s3.getObject({ Key: 'dukenukem.jpg' }, function (err, file) {
		res.sendFile(file);
	});
});

module.exports = router;
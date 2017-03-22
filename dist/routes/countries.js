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
	var db = req.db;
	var collection = db.get('countries');

	collection.find({}, {}, function (e, docs) {
		res.json(docs);
	});
})

/* GET list of Countries from Postgres */
.get('/pg', function (req, res) {
	req.pool.connect().then(function (client) {
		client.query('SELECT * FROM public.countries', []).then(function (result) {
			client.release();
			res.json(result.rows);
		}).catch(function (e) {
			client.release();
			throw e;
		});
	});
});

module.exports = router;
//# sourceMappingURL=countries.js.map
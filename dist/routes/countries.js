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
});

module.exports = router;
//# sourceMappingURL=countries.js.map
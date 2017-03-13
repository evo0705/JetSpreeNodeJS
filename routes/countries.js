var express = require('express');
var schemas = require('../schemas');
var router = express.Router();

router
	/* GET list of Countries */
	.get('/', function (req, res) {
		var db = req.db;
		var collection = db.get('countries');
			
		collection.find({}, {}, function (e, docs) {
			res.json(docs);
		});
	})
	
;

module.exports = router;
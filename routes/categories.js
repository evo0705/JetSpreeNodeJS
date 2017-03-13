var express = require('express');
var schemas = require('../schemas');
var router = express.Router();

router
	/* GET list of Categories */
	.get('/', function (req, res) {
		var db = req.db;
		var collection = db.get('categories').find({"main": null});
			
		collection.find({}, {}, function (e, docs) {
			res.json(docs);
		});
	})
	
	/* GET list of Sub Categories */
	.get('/sub', function (req, res) {
		var db = req.db;
		var collection = db.get('categories').find({"main": {$ne: null} });			
		collection.find({}, {}, function (e, docs) {
			res.json(docs);
		});
	})
	
;

module.exports = router;
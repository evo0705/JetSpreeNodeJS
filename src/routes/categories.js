import express from 'express';
import schemas from '../schemas';
const router = express.Router();

router
	/* GET list of Categories */
	.get('/', function (req, res) {
		let db = req.db;
		let collection = db.get('categories');
			
		collection.find({"main": null}, {}, function (e, docs) {
			res.json(docs);
		});
	})
	
	/* GET list of Sub Categories */
	.get('/sub', function (req, res) {
		let db = req.db;
		let collection = db.get('categories');			
		collection.find({"main": {$ne: null} }, {}, function (e, docs) {
			res.json(docs);
		});
	})
	
;

module.exports = router;
import express from 'express';
import schemas from '../schemas';
const router = express.Router();

router
	/* GET list of Countries */
	.get('/', function (req, res) {
		let db = req.db;
		let collection = db.get('countries');
			
		collection.find({}, {}, function (e, docs) {
			res.json(docs);
		});
	})
	
;

module.exports = router;
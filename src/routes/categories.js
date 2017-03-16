import express from 'express';
import schemas from '../schemas';
import pg from 'pg';

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
	
	/* GET list of Categories from Postgres */
	.get('/pg', function (req, res) {
		let client = new pg.Client();
		client.connect(function (err) {
			if (err) throw err;

			client.query('SELECT * FROM public.countries', [], function (err, result) {
				if (err) throw err;
				
				res.json(result.rows);
				
				client.end(function (err) {
					if (err) throw err;
				});
			});
		});
	})	
	
;

module.exports = router;
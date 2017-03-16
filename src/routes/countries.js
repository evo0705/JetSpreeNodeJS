import express from 'express';
import schemas from '../schemas';
import pg from 'pg';
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
	
	/* GET list of Countries from Postgres */
	.get('/pg', function (req, res) {
		let client = new pg.Client(process.env.DATABASE_URL || 'postgres://postgres:P%40ssword@localhost:5432/jetspree');
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
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

	/* GET list of Countries from Postgres */
	.get('/pg', function (req, res) {
		req.pool.connect().then(client => {
			client.query('SELECT * FROM public.countries', [])
				.then(result => {
					client.release();
					res.json(result.rows);
				})
				.catch(e => {
					client.release();
					throw e;
				});
		});
	})

	;

module.exports = router;
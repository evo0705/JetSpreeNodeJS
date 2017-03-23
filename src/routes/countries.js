import express from 'express';
import schemas from '../schemas';
const router = express.Router();

router

	/* GET list of Countries */
	.get('/', function (req, res) {
		req.pool.connect().then(client => {
			client.query('SELECT * FROM countries', [])
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
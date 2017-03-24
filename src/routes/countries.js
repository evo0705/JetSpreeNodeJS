import express from 'express';
import schemas from '../schemas';
const router = express.Router();

router

	/* GET list of Countries */
	.get('/', function (req, res) {
		req.pool.connect().then(client => {
			client.query('SELECT * FROM countries')
				.then(result => {
					client.release();
					return res.json({ success: true, result: result.rows });
				})
				.catch(err => {
					client.release();
					throw err;
					return res.json({ success: false, error: err });
				});
		});
	})

	.get("/img", function (req, res) {
		let s3 = new req.aws.S3({ params: { Bucket: 'jetspree' } });
		s3.getObject({ Key: 'dukenukem.jpg' }, function (err, file) {
			res.sendFile(file);
		});
	})

	;

module.exports = router;
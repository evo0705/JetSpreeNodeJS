import express from 'express';
import pg from 'pg';
import config from './../../config';

const router = express.Router();

router
	.get('/', function (req, res) {
		pg.connect(config.connStr, function(err, client, done) {		
			if (err) throw err;

			client.query('SELECT * FROM users WHERE id=$1', [req.decoded.id], function(err, result) {	
				done();
				if (err) throw err;
						
				if(result.rowCount == 1){					
					return res.json({
						id: result.rows[0].id,
						username: result.rows[0].username,
						admin: result.rows[0].admin
					});
				}else
					return res.json({ success: false });
			});
		});
	});
	
module.exports = router;
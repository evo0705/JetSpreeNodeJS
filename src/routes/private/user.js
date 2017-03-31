import express from "express";

const router = express.Router();

router
	.get('/', function (req, res) {
		req.pool.connect().then(client => {	
			client.query('SELECT * FROM users WHERE id=$1', [req.decoded.id])
			.then(result => {	
				client.release();

                if (result.rowCount === 1) {
					return res.json({
						id: result.rows[0].id,
						email: result.rows[0].email,
						admin: result.rows[0].admin
					});
				}else
					return res.json({ success: false });
			})
			.catch(e => {
				client.release();
				throw e;
			});
		});
	});
	
module.exports = router;
import express from 'express';
import schemas from '../schemas';
const router = express.Router();

router

    // Get list of requests
    .get('/', function (req, res) {
        req.pool.connect().then(client => {
            client.query('SELECT * FROM items')
                .then(result => {
                    return res.json({ success: true, result: result.rows });
                    client.release();
                })
                .catch(error => {
                    client.release();
                    if (error) throw error;
                    return res.json({
                        success: false,
                        message: error
                    });
                })
        })
    });

module.exports = router;
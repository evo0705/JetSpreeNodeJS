import express from "express";
const router = express.Router();

router
    .get('/', function (req, res) {
        req.pool.connect().then(client => {
            client.query('SELECT * FROM trips')
                .then(result => {
                    client.release();
                    return res.json({
                        success: true,
                        result: result.rows
                    });
                })
                .catch(error => {
                    client.release();
                    console.error(error);
                    return res.json({
                        success: false,
                        message: error
                    })
                })
        })
    });

export default router;
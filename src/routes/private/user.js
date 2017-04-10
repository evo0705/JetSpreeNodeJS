import express from "express";

const router = express.Router();

router
    .get('/', function (req, res) {
        req.pool.connect().then(client => {
            client.query('SELECT * FROM users WHERE id=$1', [req.decoded.id])
                .then(result => {
                    client.release();
                    if (result.rowCount === 1) {
                        console.log(result.rows[0]);
                        return res.json({
                            success: true,
                            result: {
                                id: result.rows[0].id,
                                email: result.rows[0].email,
                                admin: result.rows[0].admin
                            }
                        });
                    } else
                        return res.json({success: false});
                })
                .catch(e => {
                    client.release();
                    throw e;
                });
        });
    });

export default router;
import express from 'express';
import schemas from '../schemas';

const router = express;

router
    .get('/', function (req, res) {
        req.pool.connect().then(client => {
            client.query('SELECT * FROM trips')
                .then(result => {
                    return res.json({
                        success: true,
                        result: result.rows
                    });
                    client.release();
                })
                .catch(error => {
                    client.release();
                    if (error) throw error;
                    return res.json({
                        success: false,
                        message: error
                    })
                })
        })
    })
    
    .post('/', function (req,res) {

        req.checkBody(schemas.trip);
        let errors = req.validationErrors();

        if (errors) {
			return res.json({ success: false, errors: errors });
		}

        req.pool.connect().then(client => {
            client.query('INSERT INTO trips (travelcountrycode, returncountrycode, traveldate, returndate) VALUES ($1, $2, $3, $4) RETURNING id, travelcountrycode, returncountrycode, traveldate, returndate',
                [req.body.travelcountrycode, req.body.returncountrycode, req.body.traveldate, req.body.returndate])
                .then(result => {
                    client.release();
                    return res.json({
                        success: true,
                        result: result.rows[0]
                    })
                })
                .catch(error => {
                    client.release();
                    if (error) throw error;
                    return res.json({
                        success: false,
                        message: error
                    })
                })
        })
    });
    
module.exports = router;
import express from "express";
import schemas from "../../schemas";
const router = express.Router();

router

    // Post a trip
    .post('/', function (req,res) {

        req.checkBody(schemas.trip);
        let errors = req.validationErrors();

        if (errors) {
			return res.json({ success: false, errors: errors });
		}

        req.pool.connect().then(client => {
            client.query('INSERT INTO trips (travel_country_code, return_country_code, travel_date, return_date, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, travel_country_code, return_country_code, travel_date, return_date',
                [req.body.travelCountryCode, req.body.returnCountryCode, req.body.travelDate, req.body.returnDate, req.decoded.id])
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

export default router;
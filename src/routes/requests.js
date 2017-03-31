import express from "express";
import config from "../config";
const router = express.Router();

router

    // Get list of requests
    .get('/', function (req, res) {

        let queryFrom = '';
        let queryWhere = '';
        let queryParams = [];
        if(req.query.name){
            queryFrom += ", to_tsvector(name) AS the_field, plainto_tsquery($" + (queryParams.length + 1) + ") AS the_words";
            queryWhere += " AND the_field @@ the_words";
            queryParams.push(req.query.name);
        }

        req.pool.connect().then(client => {
            client.query('SELECT * FROM items' + queryFrom + ' WHERE 1=1' + queryWhere, queryParams)
                .then(result => {
                    client.release();
                    return res.json({success: true, result: result.rows, image_host: config.s3_region});
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
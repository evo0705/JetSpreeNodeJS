import express from "express";
import config from "../config";
const router = express.Router();

router

// Get list of requests.js
    .get('/', function (req, res) {

        let queryFrom = '';
        let queryWhere = '';
        let queryParams = [];
	
		let page = parseInt(req.query.page, 10);
		if (isNaN(page) || page < 1) { page = 1; }
	
		let pageSize = parseInt(req.query.pageSize, 10);
		if (isNaN(pageSize) || pageSize < 1) {
			pageSize = 10;
		} else if (pageSize > 10) {
			pageSize = pageSize;
		}
	
		var offset = (page - 1) * pageSize;
        
        if (req.query.name) {
            queryFrom += ", to_tsvector(name) AS the_field, plainto_t[squery($" + (queryParams.length + 1) + ") AS the_words";
            queryWhere += " AND the_field @@ the_words";
            queryParams.push(req.query.name);
        }
        
        if (req.query.id) {
            queryWhere += " AND id=$" + (queryParams.length + 1);
            queryParams.push(req.query.id);
        }

        req.pool.connect().then(client => {
            client.query('SELECT * FROM items OFFSET $1 LIMIT $2' + queryFrom + ' WHERE 1=1' + queryWhere, queryParams, [offset, pageSize])
                .then(result => {
                    client.release();
                    return res.json({
                        success: true,
                        result: result.rows,
                        image_host: config.s3_url + "/" + config.s3_bucket_root
                    });
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

export default router;
import express from 'express';
import schemas from '../schemas';
const router = express.Router();

router
    /* GET list of Requests */
    .get('/', function (req, res) {
        let db = req.db;
        let collection = db.get('requests');

        let page = 1;
        let pagesize = 30;
        if (req.query.page) page = parseInt(req.query.page);
        if (req.query.pagesize) pagesize = parseInt(req.query.pagesize);

        let query = {};

        if (req.query.category) {
            query.category = req.query.category;
        }

        if (req.query.name) {
            query.name = {
                $regex: new RegExp(req.query.name.match(/[^ ]+/g).join("|"), 'g'),
                $options: 'i' //i: ignore case, m: multiline, etc
            };
        }

        collection.find(query, { skip: pagesize * (page - 1), limit: pagesize }, function (e, docs) {
            res.json(docs);
        });
    })

    /* POST a new Request */
    .post('/', function (req, res) {
        req.checkBody(schemas.request);
        let errors = req.validationErrors();

        if (errors) {
            return res.send(errors);
        }

        let db = req.db;
        let collection = db.get('requests');
        collection.insert(
            {
                "uid": req.body.uid,
                "name": req.body.name,
                "category": req.body.category,
                "price": req.body.price,
                "datetime": new Date(),
                "lastModified": new Date()
            },
            function (err, result) {
                res.json(result);
            });
    })

    /* POST a batch Request for testing */
    .post('/batch', function (req, res) {
        req.checkBody(schemas.request);
        let errors = req.validationErrors();

        if (errors) {
            return res.send(errors);
        }

        for (let i = 0; i < 100; i++) {
            let db = req.db;
            let collection = db.get('requests');
            collection.insert(
                {
                    "uid": req.body.uid,
                    "name": req.body.name,
                    "category": req.body.category,
                    "price": req.body.price,
                    "datetime": new Date(),
                    "lastModified": new Date()
                },
                function (err, result) {
                    res.json(result);
                });
        }
    })

    // PostgresSQL Post and Get method
    .get('/post', function (req,res) {
        req.pool.connect().then(client => {
            client.query('SELECT * FROM public.items')
            .then(result => {
                client.release();
                var jsondata = result.rows.map((d) =>
                    ({
                        id: d.id,
                        name: d.name,
                        email: d.price,
                        description: d.description
                    })
                );
                res.send(jsondata);
                client.release();
            })
            .catch(error => {
                if (error) throw errro;
                res.send(error);
                client.release();
            })
        })
    })

    .post('/post', function (req,res) {
		req.pool.connect().then(client => {
			client.query('INSERT INTO public.items (name, price, description) VALUES ($1 , $2, $3) RETURNING id, name, price, description',
						[req.body.name, req.body.price, req.body.description])
                        .then(result => {
                            client.release();
                            return res.json(result.rows[0]);
                        })
                        .catch(error => {
                            if (error) throw error;
                            client.release();
                            return res.json({
                                success: false,
                                message: error
                            });
                        })
        })
	})

    /*
	 * DELETE Only to clear junk records, we shouldn't delete any record in
	 * Production
	 */
    .delete('/truncate', function (req, res) {
        let db = req.db;
        let collection = db.get('requests');
        collection.drop();
        res.json({ message: "truncated" });
    });

module.exports = router;
var express = require('express');
var schemas = require('../schemas');
var router = express.Router();

router
    /* GET list of Requests */
    .get('/', function (req, res) {
        var db = req.db;
        var collection = db.get('request');

        var page = 1;
        var pagesize = 30;
        if (req.query.page) page = parseInt(req.query.page);
        if (req.query.pagesize) pagesize = parseInt(req.query.pagesize);
        collection.find({}, { skip: pagesize * (page - 1), limit: pagesize }, function (e, docs) {
            res.json(docs);
        });
    })

    /* POST a new Request */
    .post('/', function (req, res) {
        req.checkBody(schemas.request);
        var errors = req.validationErrors();

        if (errors) {
            return res.send(errors);
        }

        var db = req.db;
        var collection = db.get('request');
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

    /* DELETE Only to clear junk records, we shouldn't delete any record in Production */
    .delete('/truncate', function (req, res) {
        var db = req.db;
        var collection = db.get('request');
        collection.drop();
        res.json({ message: "truncated" });
    });

module.exports = router;
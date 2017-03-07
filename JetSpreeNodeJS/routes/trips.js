var express = require('express');
var router = express.Router();

router
    /* GET list of Trips */
    .get('/', function (req, res) {
        var db = req.db;
        var collection = db.get('trip');

        var page = 1;
        var pagesize = 30;
        if (req.query.page) page = parseInt(req.query.page);
        if (req.query.pagesize) pagesize = parseInt(req.query.pagesize);
        collection.find({}, { skip: pagesize * (page - 1), limit: pagesize }, function (e, docs) {
            res.json(docs);
        });
    })

    /* POST a new Trip */
    .post('/', function (req, res) {
        var db = req.db;
        var collection = db.get('trip');

        collection.insert(
            {
                "uid": req.body.uid,
                "destinationCountry": req.body.destinationCountry,
                "returnCountry": req.body.returnCountry,
                "returnDate": req.body.returnDate,
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
        var collection = db.get('trip');
        collection.drop();
        res.json({ message: "truncated" });
    });

module.exports = router;
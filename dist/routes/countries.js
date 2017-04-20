"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _kue = require("kue");

var _kue2 = _interopRequireDefault(_kue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router

/* GET list of Countries */
.get('/', function (req, res) {

    // add email queue
    var queue = _kue2.default.createQueue({
        redis: process.env.REDIS
    });
    queue.create('email ', {
        title: 'Welcome to JetSpree',
        to: 'samuel.lee@jetspree.com',
        template: 'signup-email'
    }).priority('high').attempts(5).removeOnComplete(true).save(function (error) {
        console.error(error);
    });

    req.pool.connect().then(function (client) {
        client.query('SELECT * FROM countries').then(function (result) {
            client.release();
            return res.json({success: true, result: result.rows});
        }).catch(function (error) {
            client.release();
            console.error(error);
            return res.json({success: false, error: error});
        });
    });
}).get("/img", function (req, res) {
    var s3 = new req.aws.S3({params: {Bucket: 'jetspree'}});
    s3.getObject({Key: 'dukenukem.jpg'}, function (err, file) {
        res.sendFile(file);
    });
});

exports.default = router;
//# sourceMappingURL=countries.js.map

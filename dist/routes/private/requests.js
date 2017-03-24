'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _schemas = require('../../schemas');

var _schemas2 = _interopRequireDefault(_schemas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router

// Post a request
.post('/', function (req, res) {

    req.checkBody(_schemas2.default.request);
    var errors = req.validationErrors();

    if (errors) {
        return res.json({ success: false, errors: errors });
    }
    // buf = new Buffer(req.body.imageBinary.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    // var data = {
    //     Key: req.body.userId,
    //     Body: buf,
    //     ContentEncoding: 'base64',
    //     ContentType: 'image/jpeg'
    // };
    // s3.putObject(data, function (err, data) {
    //     if (err) {
    //         console.log(err);
    //         console.log('Error uploading data: ', data);
    //     } else {
    //         console.log('succesfully uploaded the image!');
    //     }
    // });

    req.pool.connect().then(function (client) {
        client.query('INSERT INTO items (name, price, description, user_id) VALUES ($1, $2, $3, $4) RETURNING id, name, price, description', [req.body.name, req.body.price, req.body.description, req.decoded.id]).then(function (result) {
            client.release();
            return res.json({ success: true, result: result.rows[0] });
        }).catch(function (error) {
            client.release();
            if (error) throw error;
            return res.json({
                success: false,
                message: error
            });
        });
    });
});

module.exports = router;
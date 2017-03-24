'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _schemas = require('../../schemas');

var _schemas2 = _interopRequireDefault(_schemas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router

// Post a trip
.post('/', function (req, res) {

    req.checkBody(_schemas2.default.trip);
    var errors = req.validationErrors();

    if (errors) {
        return res.json({ success: false, errors: errors });
    }

    req.pool.connect().then(function (client) {
        client.query('INSERT INTO trips (travel_country_code, return_country_code, travel_date, return_date, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, travel_country_code, return_country_code, travel_date, return_date', [req.body.travelCountryCode, req.body.returnCountryCode, req.body.travelDate, req.body.returnDate, req.decoded.id]).then(function (result) {
            client.release();
            return res.json({
                success: true,
                result: result.rows[0]
            });
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
'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _schemas = require('../schemas');

var _schemas2 = _interopRequireDefault(_schemas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res) {
    req.pool.connect().then(function (client) {
        client.query('SELECT * FROM trips').then(function (result) {
            return res.json({
                success: true,
                result: result.rows
            });
            client.release();
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
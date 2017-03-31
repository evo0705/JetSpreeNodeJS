'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res) {
    req.pool.connect().then(function (client) {
        client.query('SELECT * FROM trips').then(function (result) {
            client.release();
            return res.json({
                success: true,
                result: result.rows
            });
        }).catch(function (error) {
            client.release();
            console.error(error);
            return res.json({
                success: false,
                message: error
            });
        });
    });
});

module.exports = router;
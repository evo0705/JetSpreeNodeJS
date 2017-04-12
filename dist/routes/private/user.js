'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res) {
    req.pool.connect().then(function (client) {
        client.query('SELECT * FROM users WHERE id=$1', [req.decoded.id]).then(function (result) {
            client.release();
            if (result.rowCount === 1) {
                console.log(result.rows[0]);
                return res.json({
                    success: true,
                    result: {
                        id: result.rows[0].id,
                        email: result.rows[0].email,
                        admin: result.rows[0].admin
                    }
                });
            } else return res.json({success: false});
        }).catch(function (e) {
            client.release();
            throw e;
        });
    });
});

exports.default = router;
//# sourceMappingURL=user.js.map

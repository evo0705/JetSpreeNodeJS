"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _config = require("../config");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router

// Get list of requests.js
.get('/', function (req, res) {

    var queryFrom = '';
    var queryWhere = '';
    var queryParams = [];
    if (req.query.name) {
        queryFrom += ", to_tsvector(name) AS the_field, plainto_tsquery($" + (queryParams.length + 1) + ") AS the_words";
        queryWhere += " AND the_field @@ the_words";
        queryParams.push(req.query.name);
    }
    if (req.query.id) {
        queryWhere += " AND id=$" + (queryParams.length + 1);
        queryParams.push(req.query.id);
    }

    req.pool.connect().then(function (client) {
        client.query('SELECT * FROM items' + queryFrom + ' WHERE 1=1' + queryWhere, queryParams).then(function (result) {
            client.release();
            return res.json({
                success: true,
                result: result.rows,
                image_host: _config2.default.s3_url + "/" + _config2.default.s3_bucket_root
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

exports.default = router;
//# sourceMappingURL=requests.js.map

'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _schemas = require('../schemas');

var _schemas2 = _interopRequireDefault(_schemas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router

// Get list of requests
.get('/', function (req, res) {

    var queryFrom = '';
    var queryWhere = '';
    var queryParams = [];
    if (req.query.name) {
        queryFrom += ", to_tsvector(name) AS the_field, plainto_tsquery($" + (queryParams.length + 1) + ") AS the_words";
        queryWhere += " AND the_field @@ the_words";
        queryParams.push(req.query.name);
    }

    req.pool.connect().then(function (client) {
        client.query('SELECT * FROM items' + queryFrom + ' WHERE 1=1' + queryWhere, queryParams).then(function (result) {
            return res.json({ success: true, result: result.rows });
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
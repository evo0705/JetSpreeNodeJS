'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res) {
	req.pool.connect().then(function (client) {
		client.query('SELECT * FROM users WHERE id=$1', [req.decoded.id]).then(function (result) {
			client.release();

			if (result.rowCount == 1) {
				return res.json({
					id: result.rows[0].id,
					email: result.rows[0].email,
					admin: result.rows[0].admin
				});
			} else return res.json({ success: false });
		}).catch(function (e) {
			client.release();
			throw e;
		});
	});
});

module.exports = router;
//# sourceMappingURL=user.js.map
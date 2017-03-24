'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var CONSUMER_KEY = 'C26AzqB4KX27vptotRfsl2mci';
var CONSUMER_SECRET = 'WLn5P77bBreEU4Lx6ia75ESQFtos1hR2EhYl8HW7xoCPoWpUw8';

router.get('/user/:user', function (req, res) {
	var oauth = {
		consumer_key: CONSUMER_KEY,
		consumer_secret: CONSUMER_SECRET,
		access_token: '558478141-vP6gWUhaySNB0Lrkf2Rf2mOg8hemsHjSLyxi5GBv',
		access_token_secret: 'AVUtd9EdLpkeyt2pPerwbnna2WB1YJQnDpd7SMyITAX3Z'
	};
	_request2.default.get({ url: 'https://api.twitter.com/1.1/search/tweets.json?q=from%3A' + req.params.user, oauth: oauth }, function (e, r, body) {

		var tidyUp = JSON.parse(body).statuses.map(function (obj, i) {
			return {
				created_at: obj.created_at,
				text: obj.text,
				urls: obj.entities.urls.map(function (obj, i) {
					return obj.url;
				}),
				user: obj.user.screen_name
			};
		});
		res.send(tidyUp);
	});
});

module.exports = router;
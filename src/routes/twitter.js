import express from 'express';
import request from 'request';
import qs from 'querystring';

const router = express.Router();
const CONSUMER_KEY = 'C26AzqB4KX27vptotRfsl2mci';
const CONSUMER_SECRET = 'WLn5P77bBreEU4Lx6ia75ESQFtos1hR2EhYl8HW7xoCPoWpUw8';

router

	.get('/user/:user', function (req, res) {
		let oauth = {
			consumer_key: CONSUMER_KEY,
			consumer_secret: CONSUMER_SECRET,
			access_token: '558478141-vP6gWUhaySNB0Lrkf2Rf2mOg8hemsHjSLyxi5GBv',
			access_token_secret: 'AVUtd9EdLpkeyt2pPerwbnna2WB1YJQnDpd7SMyITAX3Z'
		};
		request.get({ url: 'https://api.twitter.com/1.1/search/tweets.json?q=from%3A' + req.params.user, oauth: oauth }, function (e, r, body) {

			let tidyUp = JSON.parse(body).statuses.map((obj, i) => {
				return {
					created_at: obj.created_at,
					text: obj.text,
					urls: obj.entities.urls.map((obj, i) => { return obj.url }),
					user: obj.user.screen_name
				};
			});
			res.send(tidyUp);
		});
	})

	;

module.exports = router;
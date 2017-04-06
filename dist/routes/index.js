'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
	res.render('index', {
		title: 'JetSpree API',
		version: require('../../package.json').version,
		apis: [{ name: "GET: Search tweets", url: "/twitter/user/nodejs", desc: "filtered JSON of tweets from twitter api" }, { name: "GET: Countries", url: "/countries", desc: "list of countries" }, { name: "GET: Requests", url: "/requests", desc: "get list of request" }, { name: "GET: Trips", url: "/trips", desc: "get list of trips" }, { name: "GET: Image", url: "/image/dukenukem.jpg?width=150&height=150", desc: "get image from S3" }, {
			name: "POST: Signup", url: "/login/signup", desc: "register a new account",
			params: [{ name: "email", desc: "-" }, { name: "password", desc: "-" }]
		}, {
			name: "POST: Login", url: "/login/account", desc: "login to jetspree account",
			params: [{ name: "email", desc: "-" }, { name: "password", desc: "-" }]
		}, { name: "GET: Login with Facebook", url: "/login/facebook", desc: "login to jetspree via facebook" }, { name: "GET: Login with Google", url: "/login/google", desc: "login to jetspree via google" }, { name: "GET: User (x-access-token)", url: "/auth/user", desc: "get logged in user's info, require x-access-token header" }, {
			name: "POST: Requests (x-access-token)", url: "/requests", desc: "create a new request",
            params: [{name: "name", desc: "-"}, {name: "price", desc: "-"}, {
                name: "description",
                desc: "-"
            }, {name: "image", desc: "base64"}]
		}, {
			name: "POST: Trips (x-access-token)", url: "/trips", desc: "create a new trip",
			params: [{ name: "travelCountryCode", desc: "-" }, { name: "returnCountryCode", desc: "-" }, { name: "travelDate", desc: "-" }, { name: "returnDate", desc: "-" }]
		}]
	});
});

exports.default = router;
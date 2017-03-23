var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
	res.render('index', {
		title: 'JetSpree API',
		version: process.env.npm_package_version,
		apis: [
			// { name: "GET: Countries (MongoDB)", url: "/countries", desc: "list of countries" },
			// { name: "GET: Categories (MongoDB)", url: "/categories", desc: "list of categories" },
			// { name: "GET: Sub-Categories (MongoDB)", url: "/categories/sub", desc: "list of sub-categories" },
			// {
			// 	name: "GET: Requests (MongoDB)", url: "/requests", desc: "list of filtered requests",
			// 	params: [
			// 		{ name: "name", desc: "filter request name" },
			// 		{ name: "category", desc: "filter category id" },
			// 		{ name: "page", desc: "pagination page number" },
			// 		{ name: "pagesize", desc: "pagination pagesize number" }
			// 	]
			// },
			{ name: "GET: Search tweets", url: "/twitter/user/nodejs", desc: "filtered JSON of tweets from twitter api" },
			{ name: "GET: Countries", url: "/countries", desc: "list of countries" },
			{
				name: "POST: Signup", url: "/login/signup", desc: "register a new account",
				params: [
					{ name: "email", desc: "-" },
					{ name: "password", desc: "-" }
				]
			},
			{
				name: "POST: Login", url: "/login/account", desc: "login to jetspree account",
				params: [
					{ name: "email", desc: "-" },
					{ name: "password", desc: "-" }
				]
			},
			{ name: "GET: Login with Facebook", url: "/login/facebook", desc: "login to jetspree via facebook" },
			{ name: "GET: Login with Google", url: "/login/google", desc: "login to jetspree via google" },
			{ name: "GET: User (x-access-token)", url: "/auth/user", desc: "get logged in user's info, require x-access-token header" },
			{
				name: "POST: Requests (PostgreSQL)", url: "/requests", desc: "create a new request",
				params: [
					{ name: "name", desc: "-"},
					{ name: "price", desc: "-"},
					{ name: "description", desc: "-"}
				]
			},
			{ name: "GET: Requests (PostgreSQL)", url: "/requests", desc: "get list of request" }
		]
	});
});

module.exports = router;
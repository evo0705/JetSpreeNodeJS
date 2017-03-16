var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { 
		title: 'JetSpree API', 
		version: process.env.npm_package_version,
		apis: [
			{ name: "GET: Countries (MongoDB)", url: "/countries", desc: "list of countries" },
			{ name: "GET: Categories (MongoDB)", url: "/categories", desc: "list of categories" },
			{ name: "GET: Requests (MongoDB)", url: "/requests", desc: "list of filtered requests", 
				params:[ 
					{ name: "name", desc: "filter request name" },
					{ name: "category", desc: "filter category id" },
					{ name: "page", desc: "pagination page number" },
					{ name: "pagesize", desc: "pagination pagesize number" } 
				] 
			},
			{ name: "GET: Countries (PostgreSQL)", url: "/categories/pg", desc: "list of categories" },
			{ name: "GET: Search tweets", url: "/twitter/user/nodejs", desc: "filtered JSON of tweets from twitter api" }
		]
	});
});

module.exports = router;
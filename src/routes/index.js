﻿var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { 
		title: 'JetSpree API', 
		version: process.env.npm_package_version,
		apis: [
			{ name: "GET: Countries (MongoDB)", url: "/countries", desc: "list of countries" },
			{ name: "GET: Categories (MongoDB)", url: "/categories", desc: "list of categories" },
			{ name: "GET: Sub-Categories (MongoDB)", url: "/categories/sub", desc: "list of sub-categories" },
			{ name: "GET: Requests (MongoDB)", url: "/requests", desc: "list of filtered requests", 
				params:[ 
					{ name: "name", desc: "filter request name" },
					{ name: "category", desc: "filter category id" },
					{ name: "page", desc: "pagination page number" },
					{ name: "pagesize", desc: "pagination pagesize number" } 
				] 
			},
			{ name: "GET: Countries (PostgreSQL)", url: "/countries/pg", desc: "list of countries" },
			{ name: "GET: Search tweets", url: "/twitter/user/nodejs", desc: "filtered JSON of tweets from twitter api" },
			{ name: "POST: Signup (PostgreSQL)", url: "/logon/signup", desc: "register a new account", 
				params:[ 
					{ name: "username", desc: "-" },
					{ name: "password", desc: "-" }
				]  
			},
			{ name: "POST: Login (PostgreSQL)", url: "/logon/authenticate", desc: "account login", 
				params:[ 
					{ name: "username", desc: "-" },
					{ name: "password", desc: "-" }
				]  
			},
			{ name: "GET: User (PostgreSQL)", url: "/auth/user", desc: "got logged in user's info" }
		]
	});
});

module.exports = router;
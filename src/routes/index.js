var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { 
		title: 'JetSpree API ', 
		version: process.env.npm_package_version,
		apis: [
			{ name: "GET: Countries", url: "/countries", desc: "return list of countries" },
			{ name: "GET: Categories", url: "/categories", desc: "return list of categories" },
			{ name: "GET: Requests", url: "/requests", desc: "return list of filtered requests", 
				params:[ 
					{ name: "name", desc: "filter request name" },
					{ name: "category", desc: "filter category id" },
					{ name: "page", desc: "pagination page number." },
					{ name: "pagesize", desc: "pagination pagesize number." } 
				] 
			}
		]
	});
});

module.exports = router;
import express from 'express';
import pg from 'pg';
import config from './../config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const saltRounds = 10;

const router = express.Router();

router

	.post('/signup', function (req, res) {
	
		if(req.body.username == undefined || req.body.password == undefined
			|| req.body.username == '' || req.body.password == ''){	
			res.json({ success: false, message: "Username and Password are required." });
		} else {
			
			//TODO: check if username already exists
			//TODO: check password strength
		
			pg.connect(config.connStr, function(err, client, done) {		
				if (err) throw err;

				// encrypt password
				bcrypt.hash(req.body.password, saltRounds)
				.then(function(hash) {
				
					// create new user record
					client.query('INSERT INTO users(username, password) VALUES($1, $2)', [req.body.username, hash], function(err, result) {	
						done();
						if (err) throw err;
						
						if(result.rowCount == 1)					
							res.json({ success: true });
						else
							res.json({ success: false });
					});
				})
				.catch(function(err){
					throw err;
				});
			});	
		}
	})
	
	.post('/authenticate', function (req, res) {
		pg.connect(config.connStr, function(err, client, done) {		
			if (err) throw err;
			
			// find the user
			client.query('SELECT * FROM users WHERE username=$1 LIMIT 1', [req.body.username], function(err, result) {			
				done();
				if (err) throw err;
				
				// user not found
				if(result.rows.length < 1) {
					res.json({ success: false, message: 'Authentication failed.' });
				} else {
					var user = result.rows[0];
					
					bcrypt.compare(req.body.password, user.password)
					.then(function(match) {
					
						// wrong password
						if (!match) {
							res.json({ success: false, message: 'Authentication failed.' });
						} else {	
						
							// create a token
							var token = jwt.sign(user, config.secret, {
								expiresIn: config.tokenDuration
							});
							
							// return the token information
							res.json({
								success: true,
								token: token,
								expiresIn: config.tokenDuration
							});
						}
						
					});
				}
			});
		});
		
	})
	
	/*
	.post('/token', function (req, res) {
		
		var originalDecoded = jwt.decode(req.body.token, {complete: true});
		var refreshed = jwt.refresh(originalDecoded, config.tokenDuration, config.secret);
		
		// return the new token information
		res.json({
			success: true,
			token: refreshed,
			expiresIn: config.tokenDuration
		});
	})
	*/
	
;

module.exports = router;
import express from 'express';
import config from './../../config';
import jwt from 'jsonwebtoken';

const router = express.Router();

router
	.use(function(req, res, next) {
		var token = req.body.token || req.query.token || req.headers['x-access-token'];
		if (token) {
		
			// verifies secret and checks exp
			jwt.verify(token, config.secret, function(err, decoded) {      
				if (err) {
					return res.json({ success: false, message: 'Failed to authenticate token.' });    
				} else {
				
					// save to request for use in other routes
					req.decoded = decoded;    
					next();
				}
			});

		} else {

			// there is no token
			return res.status(403).send({ 
				success: false, 
				message: 'No valid token provided.' 
			});
		
		}
	});

module.exports = router;
'use strict';

var schema = {
	'email': {
		notEmpty: true,
		errorMessage: 'Email address is required.',
		isEmail: {
			errorMessage: 'Invalid email address.'
		}
	},
	'password': {
		notEmpty: true,
		errorMessage: 'Password is required.',
		isLength: {
			options: [{ min: 6 }],
			errorMessage: 'Password must be at least 6 characters long.'
		}
	}
};

module.exports = schema;
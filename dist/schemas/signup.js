'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
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

exports.default = schema;
//# sourceMappingURL=signup.js.map

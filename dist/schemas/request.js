'use strict';

var schema = {
	'name': {
		notEmpty: true,
		errorMessage: 'Item name is required.'
	},
	'price': {
		notEmpty: true,
		errorMessage: 'Price is required.',
		isFloat: {
			errorMessage: 'Invalid price.'
		}
	},
	'description': {
		notEmpty: true,
		errorMessage: 'Description is required.'
    },
    'image': {
        notEmpty: true,
        errorMessage: 'Image is required.'
	}
};

module.exports = schema;
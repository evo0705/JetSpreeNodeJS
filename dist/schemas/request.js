'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
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

exports.default = schema;
//# sourceMappingURL=request.js.map

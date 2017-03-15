'use strict';

var trip = {
	'uid': {
		notEmpty: true,
		errorMessage: 'Invalid uid'
	},
	'destinationCountry': {
		notEmpty: true,
		errorMessage: 'Invalid destinationCountry'
	},
	'returnCountry': {
		notEmpty: true,
		errorMessage: 'Invalid returnCountry'
	},
	'returnDate': {
		notEmpty: true,
		errorMessage: 'Invalid returnDate'
	},
	'datetime': {
		notEmpty: true,
		errorMessage: 'Invalid datetime'
	},
	'lastModified': {
		notEmpty: true,
		errorMessage: 'Invalid datetime'
	}
};

module.exports = trip;
//# sourceMappingURL=trip.js.map
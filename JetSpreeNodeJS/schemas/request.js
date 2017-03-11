request = {
	'uid' : {
		notEmpty : true,
		errorMessage : 'Invalid uid'
	},
	'name' : {
		notEmpty : true,
		errorMessage : 'Invalid name'
	},
	'category' : {
		notEmpty : true,
		errorMessage : 'Invalid category'
	},
	'price' : {
		notEmpty : true,
		errorMessage : 'Invalid price'
	},
	'datetime' : {
		notEmpty : true,
		errorMessage : 'Invalid datetime'
	},
	'lastModified' : {
		notEmpty : true,
		errorMessage : 'Invalid datetime'
	}
};

module.exports = request;
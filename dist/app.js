'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressValidator = require('express-validator');

var _expressValidator2 = _interopRequireDefault(_expressValidator);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _serveFavicon = require('serve-favicon');

var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _monk = require('monk');

var _monk2 = _interopRequireDefault(_monk);

var _index = require('./routes/index');

var _index2 = _interopRequireDefault(_index);

var _requests = require('./routes/requests');

var _requests2 = _interopRequireDefault(_requests);

var _countries = require('./routes/countries');

var _countries2 = _interopRequireDefault(_countries);

var _categories = require('./routes/categories');

var _categories2 = _interopRequireDefault(_categories);

var _trips = require('./routes/trips');

var _trips2 = _interopRequireDefault(_trips);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var db = (0, _monk2.default)('admin:P%40ssword123@cluster0-shard-00-00-ajvux.mongodb.net:27017,cluster0-shard-00-01-ajvux.mongodb.net:27017,cluster0-shard-00-02-ajvux.mongodb.net:27017/jetspree?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');

// view engine setup
app.set('views', _path2.default.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use((0, _serveFavicon2.default)(__dirname + '/public/favicon.ico'));
app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.json());
app.use((0, _expressValidator2.default)([]));
app.use(_bodyParser2.default.urlencoded({
	extended: true
}));
app.use((0, _cookieParser2.default)());
app.use(require('stylus').middleware(_path2.default.join(__dirname, 'public')));
app.use(_express2.default.static(_path2.default.join(__dirname, 'public')));

app.use(function (req, res, next) {
	req.db = db;
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use('/', _index2.default);
app.use('/requests', _requests2.default);
app.use('/countries', _countries2.default);
app.use('/categories', _categories2.default);
app.use('/trips', _trips2.default);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

app.listen(process.env.PORT || 3001, function () {
	console.log("Started on port %d in %s mode", this.address().port, app.settings.env);
});

module.exports = app;
//# sourceMappingURL=app.js.map
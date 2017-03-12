var express = require('express');
var expressValidator = require('express-validator');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongo = require('mongodb');
var monk = require('monk');
//var db = monk('localhost:27017/HelloWorld');
var db = monk('admin:P%40ssword123@cluster0-shard-00-00-ajvux.mongodb.net:27017,cluster0-shard-00-01-ajvux.mongodb.net:27017,cluster0-shard-00-02-ajvux.mongodb.net:27017/jetspree?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');

//var mongo_express = require('./node_modules/mongo-express/lib/middleware')
//var mongo_express_config = require('./node_modules/mongo-express/config')

var routes = require('./routes/index');
var requests = require('./routes/requests');
var trips = require('./routes/trips');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(expressValidator([]));
app.use(bodyParser.urlencoded({
	extended : true
}));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
	req.db = db;
	next();
});

app.use('/', routes);
//app.use('/admin/dbui', mongo_express(mongo_express_config));
app.use('/api/requests', requests);
app.use('/api/trips', trips);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message : err.message,
			error : err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message : err.message,
		error : {}
	});
});

app.listen(process.env.PORT || 3001, function(){
  console.log("Started on port %d in %s mode", this.address().port, app.settings.env);
});

module.exports = app;

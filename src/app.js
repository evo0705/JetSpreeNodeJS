// libraries
import config from './config';
import express from 'express';
import expressSession from 'express-session';
import expressValidator from 'express-validator';
import pgPool from 'pg-pool';
import url from 'url';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import mongo from 'mongodb';
import monk from 'monk';
import passport from 'passport';
import passportSetup from './passport';
import flash from 'connect-flash';

import routes from './routes/index';
// public routes
import requests from './routes/requests';
import countries from './routes/countries';
import categories from './routes/categories';
import trips from './routes/trips';
import twitter from './routes/twitter';
import login from './routes/login';
// private routes
import authorize from './routes/private/authorize';
import user from './routes/private/user';

const app = express();
const db = monk('admin:P%40ssword123@cluster0-shard-00-00-ajvux.mongodb.net:27017,cluster0-shard-00-01-ajvux.mongodb.net:27017,cluster0-shard-00-02-ajvux.mongodb.net:27017/jetspree?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(expressValidator([]));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	req.db = db;
	let parsedConnStr = url.parse(config.connection_string);
	let dbAuth = parsedConnStr.auth.split(':');
	let dbConfig = {
		user: dbAuth[0],
		password: dbAuth[1],
		host: parsedConnStr.hostname,
		port: parsedConnStr.port,
		database: parsedConnStr.pathname.split('/')[1],
		ssl: req.secure
	};
	req.pool = new pgPool(dbConfig);
	passportSetup(passport, req.pool);
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// required for passport
app.use(expressSession({
    secret: config.secret,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Facebook Passport Router
app.get('/login/facebook', passport.authenticate('facebook'));
app.get('/login/facebook/callback',
	passport.authenticate('facebook', {
		successRedirect: '/login/authenticated',
		failureRedirect: '/login'
	}));

app.use('/', routes);
app.use('/requests', requests);
app.use('/countries', countries);
app.use('/categories', categories);
app.use('/trips', trips);
app.use('/twitter', twitter);
app.use('/login', login);

// routes that requires login to access
authorize.use('/user', user);
app.use('/auth', authorize);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use((err, req, res, next) => {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
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

"use strict";

var _config = require("./config");

var _config2 = _interopRequireDefault(_config);

var _passportFacebook = require("passport-facebook");

var _passportGoogleOauth = require("passport-google-oauth");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = function (passport, pool) {

    // Passport session setup.
    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    // Use the FacebookStrategy within Passport.
    passport.use(new _passportFacebook.Strategy({
        clientID: _config2.default.facebook_app_id,
        clientSecret: _config2.default.facebook_app_secret,
        callbackURL: _config2.default.facebook_callback_url,
        profileFields: ['id', 'displayName', 'photos', 'email'],
        passReqToCallback: true
    }, function (req, token, refreshToken, profile, done) {
        process.nextTick(function () {
            var _this = this;

            //Check whether the User exists or not using profile.id
            _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var user, client, result;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                user = {};
                                _context.next = 3;
                                return pool.connect();

                            case 3:
                                client = _context.sent;
                                _context.prev = 4;
                                _context.next = 7;
                                return client.query('SELECT id,email FROM users WHERE facebook_id=$1 OR email=$2', [profile.id, profile.emails[0].value]);

                            case 7:
                                result = _context.sent;

                                if (!(result.rows.length === 0)) {
                                    _context.next = 12;
                                    break;
                                }

                                _context.next = 11;
                                return client.query('INSERT INTO users (email, password, facebook_id) VALUES($1,$2,$3) RETURNING id,email', [profile.emails[0].value, null, profile.id]);

                            case 11:
                                result = _context.sent;

                            case 12:
                                user = result.rows[0];
                                _context.next = 19;
                                break;

                            case 15:
                                _context.prev = 15;
                                _context.t0 = _context["catch"](4);

                                console.error(_context.t0.message, e.stack);
                                return _context.abrupt("return", done(_context.t0));

                            case 19:
                                _context.prev = 19;

                                client.release();
                                return _context.finish(19);

                            case 22:
                                return _context.abrupt("return", done(null, user));

                            case 23:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, _this, [[4, 15, 19, 22]]);
            }))().catch(function (err) {
                console.error(err.message, e.stack);
                return done(err);
            });
        });
    }));

    // Use the GoogleStrategy within Passport.
    passport.use(new _passportGoogleOauth.OAuth2Strategy({
        clientID: _config2.default.google_client_id,
        clientSecret: _config2.default.google_client_secret,
        callbackURL: _config2.default.google_callback_url,
        passReqToCallback: true
    }, function (req, token, refreshToken, profile, done) {
        process.nextTick(function () {
            var _this2 = this;

            //Check whether the User exists or not using profile.id
            _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                var user, client, result;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                user = {};
                                _context2.next = 3;
                                return pool.connect();

                            case 3:
                                client = _context2.sent;
                                _context2.prev = 4;
                                _context2.next = 7;
                                return client.query('SELECT id,email FROM users WHERE google_id=$1 OR email=$2', [profile.id, profile.emails[0].value]);

                            case 7:
                                result = _context2.sent;

                                if (!(result.rows.length === 0)) {
                                    _context2.next = 12;
                                    break;
                                }

                                _context2.next = 11;
                                return client.query('INSERT INTO users (email, password, google_id) VALUES($1,$2,$3) RETURNING id,email', [profile.emails[0].value, null, profile.id]);

                            case 11:
                                result = _context2.sent;

                            case 12:
                                user = result.rows[0];
                                _context2.next = 19;
                                break;

                            case 15:
                                _context2.prev = 15;
                                _context2.t0 = _context2["catch"](4);

                                console.error(_context2.t0.message, e.stack);
                                return _context2.abrupt("return", done(_context2.t0));

                            case 19:
                                _context2.prev = 19;

                                client.release();
                                return _context2.finish(19);

                            case 22:
                                return _context2.abrupt("return", done(null, user));

                            case 23:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, _this2, [[4, 15, 19, 22]]);
            }))().catch(function (err) {
                console.error(err.message, e.stack);
                return done(err);
            });
        });
    }));
};
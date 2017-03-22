'use strict';

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _passportFacebook = require('passport-facebook');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

//import { Strategy as GoogleStrategy } from 'passport-google';

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
        profileFields: ['id', 'displayName', 'photos', 'email']
    }, function (accessToken, refreshToken, profile, done) {
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
                                return client.query('SELECT id,email FROM users WHERE facebook_id=$1', [profile.id]);

                            case 7:
                                result = _context.sent;

                                if (!(result.rows.length == 0)) {
                                    _context.next = 12;
                                    break;
                                }

                                _context.next = 11;
                                return client.query('INSERT INTO users (email, password, facebook_id) VALUES($1,$2,$3) RETURNING id,email', [profile.emails[0].value, "123456", profile.id]);

                            case 11:
                                result = _context.sent;

                            case 12:
                                user = result.rows[0];

                            case 13:
                                _context.prev = 13;

                                client.release();
                                return _context.finish(13);

                            case 16:
                                return _context.abrupt('return', done(null, user));

                            case 17:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, _this, [[4,, 13, 16]]);
            }))().catch(function (err) {
                console.error(err.message, e.stack);
                return done(err);
            });
        });
    }));
};
//# sourceMappingURL=passport.js.map
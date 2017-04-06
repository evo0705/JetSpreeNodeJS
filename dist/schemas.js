'use strict';

var _signup = require('./schemas/signup');

var _signup2 = _interopRequireDefault(_signup);

var _request = require('./schemas/request');

var _request2 = _interopRequireDefault(_request);

var _trip = require('./schemas/trip');

var _trip2 = _interopRequireDefault(_trip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schemas = {
    signup: _signup2.default,
    request: _request2.default,
    trip: _trip2.default
};

module.exports = schemas;
//# sourceMappingURL=schemas.js.map
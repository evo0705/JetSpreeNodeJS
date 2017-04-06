"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _schemas = require("../../schemas");

var _schemas2 = _interopRequireDefault(_schemas);

var _config = require("../../config");

var _config2 = _interopRequireDefault(_config);

var _gm = require("gm");

var _gm2 = _interopRequireDefault(_gm);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _slug = require("slug");

var _slug2 = _interopRequireDefault(_slug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router

// Post a request
.post('/', function (req, res) {

    // validate user's input
    req.checkBody(_schemas2.default.request);
    var errors = req.validationErrors();
    if (errors) return res.json({ success: false, errors: errors });

    // image details and check type
    var imageData = req.body.image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var imageExt = imageData[1].substring(6).toLowerCase().replace("jpeg", "jpg");
    if (['jpg', 'png', 'gif', 'webp'].indexOf(imageExt) < 0) {
        return res.json({success: false, errors: [{field: "image", msg: "Unsupported image type."}]});
    }

    var handleError = function handleError(error) {
        console.error(error);
        res.json({ success: false, errors: [error] });
        res.end();
        throw new Error();
    };

    var insertRequest = function insertRequest() {
        return new _bluebird2.default(function (resolve, reject) {
            req.pool.connect().then(function (client) {
                client.query('INSERT INTO items (name, price, description, user_id) ' + 'VALUES ($1, $2, $3, $4) RETURNING id, name, price, description', [req.body.name, req.body.price, req.body.description, req.decoded.id]).then(function (result) {
                    client.release();
                    resolve(result.rows[0]);
                }).catch(function (error) {
                    client.release();
                    reject(error);
                });
            }).catch(function (error) {
                reject(error);
            });
        });
    };

    var uploadImage = function uploadImage(ret) {
        return new _bluebird2.default(function (resolve, reject) {
            _bluebird2.default.promisifyAll(_gm2.default.prototype);
            var imageName = (0, _slug2.default)(req.body.name.toLowerCase()) + "." + imageExt;
            var buffer = Buffer.from(imageData[2], 'base64');

            // s3 initialization and objects that required
            var s3 = new req.aws.S3();
            var bucket = "/requests/" + ret.id;
            var data = {
                Bucket: _config2.default.s3_bucket_root + bucket,
                Key: imageName,
                Body: buffer,
                ContentType: imageData[1]
            };
            var image = (0, _gm2.default)(buffer);
            return image.size(function (error, size) {
                if (error) reject(error);
                if (size.width > _config2.default.image_max_resolution.width || size.height > _config2.default.image_max_resolution.height) {
                    image.resize(_config2.default.image_max_resolution.width, _config2.default.image_max_resolution.height).toBuffer(imageExt, function (error, buff) {
                        if (error) reject(error);else data.Body = buff;
                    });
                } else {
                    image.resize(size.width, size.height).toBuffer(imageExt, function (error, buff) {
                        if (error) reject(error);else data.Body = buff;
                    });
                }
            }).identifyAsync().then(function () {
                return s3.putObject(data).promise();
            }, handleError).catch(Error).then(function () {
                ret.imagePath = bucket + "/" + imageName;
                resolve(ret);
            }, handleError).catch(Error).catch(function (error) {
                reject(error);
            });
        });
    };

    var updateImagePath = function updateImagePath(ret) {
        return new _bluebird2.default(function (resolve, reject) {
            req.pool.connect().then(function (client) {
                client.query('UPDATE items SET image_path=$1 WHERE id=$2 AND user_id=$3', [ret.imagePath, ret.id, req.decoded.id]).then(function () {
                    client.release();
                    resolve(ret);
                }).catch(function (error) {
                    client.release();
                    reject(error);
                });
            }).catch(function (error) {
                reject(error);
            });
        });
    };

    insertRequest().then(uploadImage, handleError).catch(Error).then(updateImagePath, handleError).catch(Error).then(function (ret) {
        res.json({ success: true, result: ret });
        res.end();
    }, handleError).catch(Error);
});

exports.default = router;
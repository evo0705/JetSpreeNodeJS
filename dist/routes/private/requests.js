"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _schemas = require("../../schemas");

var _schemas2 = _interopRequireDefault(_schemas);

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
    if (errors) return res.json({success: false, errors: errors});

    insertRequest(req).then(function (ret) {
        return uploadImage(req, ret);
    }, function (error) {
        // insertRequest() error
        console.error(error);
        return res.json({success: false, errors: [error]});
    }).then(function (ret) {
        return updateImagePath(req, ret);
    }, function (error) {
        // uploadImage() error
        console.error(error);
        return res.json({success: false, errors: [error]});
    }).then(function (ret) {
        return res.json({success: true, result: ret});
    }, function (error) {
        // updateImagePath() error
        console.error(error);
        return res.json({success: false, errors: [error]});
    });

    function insertRequest(req) {
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
    }

    function uploadImage(req, ret) {
        return new _bluebird2.default(function (resolve, reject) {
            _bluebird2.default.promisifyAll(_gm2.default.prototype);

            // image details
            var imageName = (0, _slug2.default)(req.body.name.toLowerCase()) + ".jpg";
            var imageData = req.body.image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            var buffer = Buffer.from(imageData[2], 'base64');

            // s3 initialization and objects that required
            var s3 = new req.aws.S3();
            var bucket = "/requests/" + ret.id;
            var data = {
                Bucket: bucket,
                Key: imageName,
                Body: buffer,
                ContentType: imageData[1]
            };
            var image = (0, _gm2.default)(buffer);
            return image.size(function (err, size) {
                if (err) reject(err);
                if (size.width > 100 || size.height > 100) image.resize(100, 100).toBuffer('jpg', function (err, buff) {
                    buffer = buff;
                }); else image.resize(size.width, size.height).toBuffer('jpg', function (err, buff) {
                    buffer = buff;
                });
            }).identifyAsync().then(s3.putObject(data).promise()).then(function () {
                ret.imagePath = bucket + "/" + imageName;
                resolve(ret);
            }).catch(function (error) {
                reject(error);
            });
        });
    }

    function updateImagePath(req, ret) {
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
    }
});

module.exports = router;
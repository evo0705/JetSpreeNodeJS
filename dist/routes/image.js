"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _gm = require("gm");

var _gm2 = _interopRequireDefault(_gm);

var _config = require("../config");

var _config2 = _interopRequireDefault(_config);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router

// Get image
.get(['/:key', '/:folder1/:key', '/:folder1/:folder2/:key', '/:folder1/:folder2/:folder3/:key', '/:folder1/:folder2/:folder3/:folder4/:key', '/:folder1/:folder2/:folder3/:folder4/:folder5/:key'], function (req, res) {
    var originalBucket = _config2.default.s3_bucket_root;
    var bucket = '';

    // structure folders, may add more folders if necessary
    if (req.params.folder1 !== undefined) originalBucket += "/" + req.params.folder1;
    if (req.params.folder2 !== undefined) originalBucket += "/" + req.params.folder2;
    if (req.params.folder3 !== undefined) originalBucket += "/" + req.params.folder3;
    if (req.params.folder4 !== undefined) originalBucket += "/" + req.params.folder4;
    if (req.params.folder5 !== undefined) originalBucket += "/" + req.params.folder5;

    if (/^\d+$/.test(req.query.width) && /^\d+$/.test(req.query.height)) {
        bucket += originalBucket + "/" + req.query.width + "_" + req.query.height;
        if (req.query.crop === 'true') {
            bucket += "_crop";
        }
    } else {
        return res.redirect(_config2.default.s3_url + "/" + originalBucket + "/" + req.params.key);
    }

    var s3 = new req.aws.S3();

    var getResized = function getResized() {
        return new _bluebird2.default(function (resolve) {
            s3.getObject({ Bucket: bucket, Key: req.params.key }, function (error, response) {
                if (error) resolve(null);else resolve(response);
            });
        });
    };

    var getOriginal = function getOriginal() {
        return new _bluebird2.default(function (resolve, reject) {
            s3.getObject({ Bucket: originalBucket, Key: req.params.key }, function (error, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });
    };

    var resizeImage = function resizeImage(data) {
        return new _bluebird2.default(function (resolve, reject) {
            if (!/^\d+$/.test(req.query.width) && !/^\d+$/.test(req.query.height)) {
                resolve(data);
            } else {
                if (req.query.crop === 'true') {
                    var newSize = req.query.width > req.query.height ? req.query.width : req.query.height;
                    (0, _gm2.default)(data.Body).resize(newSize, newSize, '^').gravity("Center").crop(req.query.width, req.query.height).toBuffer('jpg', function (error, buffer) {
                        if (error) reject(error); else {
                            data.Body = buffer;
                            resolve(data);
                        }
                    });
                } else {
                    (0, _gm2.default)(data.Body).resize(req.query.width, req.query.height).toBuffer('jpg', function (error, buffer) {
                        if (error) reject(error); else {
                            data.Body = buffer;
                            resolve(data);
                        }
                    });
                }
            }
        });
    };

    var putObject = function putObject(data) {
        return new _bluebird2.default(function (resolve, reject) {
            if (!/^\d+$/.test(req.query.width) && !/^\d+$/.test(req.query.height)) {
                resolve(data);
            } else if (!data.ContentLength) {
                reject({ statusCode: 404 });
            } else {
                var params = {
                    Bucket: bucket,
                    Key: req.params.key,
                    Body: data.Body,
                    ContentType: data.ContentType
                };
                s3.putObject(params, function (error) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            }
        });
    };

    var handleError = function handleError(error) {
        if (error.statusCode === 404) res.status(404).send("Not Found");else res.json({ success: false, errors: [error] });
        res.end();
        throw new Error();
    };

    var handleRespond = function handleRespond(respond) {
        res.writeHead(200, {
            'Content-Type': respond.ContentType,
            'Content-Length': respond.Body.length
        });
        res.end(respond.Body, 'binary');
    };

    getResized().then(function (ret) {
        if (ret === null) {
            // resized image not found, get the original image to resize
            return getOriginal().then(resizeImage, handleError).catch(Error).then(putObject, handleError).catch(Error).then(handleRespond, handleError).catch(Error);
        } else {
            if (ret.ContentLength > 0) {
                // resized image found, so just respond it.
                handleRespond(ret);
            } else {
                // probably wrong url or the file no longer exists.
                res.end();
            }
        }
    }, handleError).catch(Error);
});

exports.default = router;
//# sourceMappingURL=image.js.map

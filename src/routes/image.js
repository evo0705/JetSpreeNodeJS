import express from "express";
import GM from "gm";
import config from "../config";
import Promise from "bluebird";
const router = express.Router();

router

// Get image
    .get(['/:key', '/:folder1/:key',
            '/:folder1/:folder2/:key',
            '/:folder1/:folder2/:folder3/:key',
            '/:folder1/:folder2/:folder3/:folder4/:key',
            '/:folder1/:folder2/:folder3/:folder4/:folder5/:key'],
        (req, res) => {
            let originalBucket = config.s3_bucket_root;
            let bucket = '';

            // structure folders, may add more folders if necessary
            if (req.params.folder1 !== undefined)
                originalBucket += "/" + req.params.folder1;
            if (req.params.folder2 !== undefined)
                originalBucket += "/" + req.params.folder2;
            if (req.params.folder3 !== undefined)
                originalBucket += "/" + req.params.folder3;
            if (req.params.folder4 !== undefined)
                originalBucket += "/" + req.params.folder4;
            if (req.params.folder5 !== undefined)
                originalBucket += "/" + req.params.folder5;

            if (/^\d+$/.test(req.query.width) && /^\d+$/.test(req.query.height)) {
                bucket += originalBucket + "/" + req.query.width + "_" + req.query.height;
                if (req.query.crop === 'true') {
                    bucket += "_crop"
                }
            } else {
                return res.redirect(config.s3_url + "/" + originalBucket + "/" + req.params.key);
            }

            let s3 = new req.aws.S3();

            let getResized = function () {
                return new Promise(function (resolve) {
                    s3.getObject({Bucket: bucket, Key: req.params.key}, (error, response) => {
                        if (error)
                            resolve(null);
                        else
                            resolve(response)
                    });
                });
            };

            let getOriginal = function () {
                return new Promise(function (resolve, reject) {
                    s3.getObject({Bucket: originalBucket, Key: req.params.key}, (error, response) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(response);
                        }
                    });
                });
            };

            let resizeImage = function (data) {
                return new Promise(function (resolve, reject) {
                    if (!/^\d+$/.test(req.query.width) && !/^\d+$/.test(req.query.height)) {
                        resolve(data);
                    } else {
                        if (req.query.crop === 'true') {
                            let newSize = (req.query.width > req.query.height ? req.query.width : req.query.height);
                            GM(data.Body)
                                .resize(newSize, newSize, '^')
                                .gravity("Center")
                                .crop(req.query.width, req.query.height)
                                .toBuffer('jpg', (error, buffer) => {
                                    if (error)
                                        reject(error);
                                    else {
                                        data.Body = buffer;
                                        resolve(data);
                                    }
                                });
                        } else {
                            GM(data.Body)
                                .resize(req.query.width, req.query.height)
                                .toBuffer('jpg', (error, buffer) => {
                                    if (error)
                                        reject(error);
                                    else {
                                        data.Body = buffer;
                                        resolve(data);
                                    }
                                });
                        }
                    }
                });
            };

            let putObject = function (data) {
                return new Promise(function (resolve, reject) {
                    if (!/^\d+$/.test(req.query.width) && !/^\d+$/.test(req.query.height)) {
                        resolve(data);
                    } else if (!data.ContentLength) {
                        reject({statusCode: 404});
                    } else {
                        let params = {
                            Bucket: bucket,
                            Key: req.params.key,
                            Body: data.Body,
                            ContentType: data.ContentType
                        };
                        s3.putObject(params, (error) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(data);
                            }
                        });
                    }
                });
            };

            let handleError = function (error) {
                if (error.statusCode === 404)
                    res.status(404).send("Not Found");
                else
                    res.json({success: false, errors: [error]});
                res.end();
                throw new Error();
            };

            let handleRespond = function (respond) {
                res.writeHead(200, {
                    'Content-Type': respond.ContentType,
                    'Content-Length': respond.Body.length
                });
                res.end(respond.Body, 'binary');
            };

            getResized()
                .then(ret => {
                    if (ret === null) {
                        // resized image not found, get the original image to resize
                        return getOriginal()
                            .then(resizeImage, handleError).catch(Error)
                            .then(putObject, handleError).catch(Error)
                            .then(handleRespond, handleError).catch(Error)
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

export default router;
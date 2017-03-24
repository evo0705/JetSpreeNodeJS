import express from 'express';
import gm from 'gm';
import config from '../config';
const router = express.Router();

router

    // Get image
    .get('/:key', function (req, res) {
        let originalBucket = config.s3_bucket_root;
        let bucket = config.s3_bucket_root;

        if (req.query.width && req.query.height)
            bucket += "/" + req.query.width + "_" + req.query.height;

        let s3 = new req.aws.S3({ params: { Bucket: bucket } });
        s3.getObject({ Bucket: bucket, Key: req.params.key })
            .on('success', function (response) {
                console.log("resized image found");
                // resized image found
                res.writeHead(200, {
                    'Content-Type': response.data.ContentType,
                    'Content-Length': response.data.ContentLength
                });
                return res.end(response.data.Body, 'binary');
            }).on('error', function (error) {
                // resized image not found, get the original image for resize
                s3.getObject({ Bucket: originalBucket, Key: req.params.key })
                    .on('success', function (response) {
                        gm(response.data.Body)
                            .resize(req.query.width, req.query.height)
                            .toBuffer(function (err, buffer) {
                                // upload resized image to S3
                                var data = {
                                    Bucket: bucket,
                                    Key: req.params.key,
                                    Body: buffer,
                                    ContentType: response.data.ContentType
                                };
                                s3.createBucket(bucket, function (err, response) {
                                    s3.putObject(data)
                                        .on('success', function (response) {
                                            res.writeHead(200, {
                                                'Content-Type': data.ContentType,
                                                'Content-Length': buffer.length
                                            });
                                            return res.end(buffer, 'binary');
                                        }).on('error', function (error) {
                                            console.error(error);
                                            let err = new Error('Not Found');
                                            err.status = 404;
                                            next(err);
                                        }).send();
                                });
                            });
                    }).on('error', function (error) {
                        console.error(error);
                        let err = new Error('Not Found');
                        err.status = 404;
                        next(err);
                    }).send();
            }).send();
    });

module.exports = router;
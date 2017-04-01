import express from "express";
import schemas from "../../schemas";
import config from "../../config";
import GM from "gm";
import Promise from "bluebird";
import Slug from "slug";

const router = express.Router();

router

// Post a request
    .post('/', function (req, res) {

        // validate user's input
        req.checkBody(schemas.request);
        let errors = req.validationErrors();
        if (errors) return res.json({success: false, errors: errors});

        // image details
        let imageData = req.body.image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let imageExt = imageData[1].substring(6).toLowerCase().replace("jpeg", "jpg");
        if (['jpg', 'png', 'gif', 'webp'].indexOf(imageExt) < 0) {
            return res.json({success: false, errors: [{field: "image", msg: "Unsupported image type."}]});
        }

        let handleError = function (error) {
            console.error(error);
            res.json({success: false, errors: [error]});
            res.end();
            throw new Error();
        };

        let insertRequest = function () {
            return new Promise((resolve, reject) => {
                req.pool.connect()
                    .then(client => {
                        client.query('INSERT INTO items (name, price, description, user_id) '
                            + 'VALUES ($1, $2, $3, $4) RETURNING id, name, price, description',
                            [req.body.name, req.body.price, req.body.description, req.decoded.id])
                            .then(result => {
                                client.release();
                                resolve(result.rows[0]);
                            })
                            .catch(error => {
                                client.release();
                                reject(error);
                            });
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        };

        let uploadImage = function (ret) {
            return new Promise((resolve, reject) => {
                Promise.promisifyAll(GM.prototype);
                let imageName = Slug(req.body.name.toLowerCase()) + "." + imageExt;
                let buffer = Buffer.from(imageData[2], 'base64');

                // s3 initialization and objects that required
                let s3 = new req.aws.S3();
                let bucket = config.s3_bucket_root + "/requests/" + ret.id;
                let data = {
                    Bucket: bucket,
                    Key: imageName,
                    Body: buffer,
                    ContentType: imageData[1]
                };
                let image = GM(buffer);
                return image
                    .size((error, size) => {
                        if (error) reject(error);
                        if (size.width > config.image_max_resolution.width ||
                            size.height > config.image_max_resolution.height) {
                            image.resize(config.image_max_resolution.width,
                                config.image_max_resolution.height).toBuffer(imageExt, (error, buff) => {
                                if (error) reject(error);
                                else data.Body = buff;
                            });
                        } else {
                            image.resize(size.width, size.height).toBuffer(imageExt, (error, buff) => {
                                if (error) reject(error);
                                else data.Body = buff;
                            });
                        }
                    }).identifyAsync()
                    .then(() => {
                        return s3.putObject(data).promise();
                    }, handleError).catch(Error)
                    .then(() => {
                        ret.imagePath = bucket + "/" + imageName;
                        resolve(ret);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        };

        let updateImagePath = function (ret) {
            return new Promise((resolve, reject) => {
                req.pool.connect()
                    .then(client => {
                        client.query('UPDATE items SET image_path=$1 WHERE id=$2 AND user_id=$3',
                            [ret.imagePath, ret.id, req.decoded.id])
                            .then(() => {
                                client.release();
                                resolve(ret);
                            })
                            .catch(error => {
                                client.release();
                                reject(error);
                            });
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        };

        insertRequest()
            .then(uploadImage, handleError).catch(Error)
            .then(updateImagePath, handleError).catch(Error)
            .then(ret => {
                res.json({success: true, result: ret});
                res.end();
            }, handleError).catch(Error);
    });

module.exports = router;
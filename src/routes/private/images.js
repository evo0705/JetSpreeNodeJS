import express from "express";
import Promise from "bluebird";
import cloudinary from "cloudinary";
import multer from "multer";
import autoReap from "multer-autoreap";
import config from "../../config";
autoReap.options.reapOnError = false;
const router = express.Router();
//const storage = multer.memoryStorage()
const upload = multer({dest: './uploads/'});//({ storage: storage });

router

    .post('/upload', upload.array('photos'), autoReap, function (req, res, next) {
        let result = {
            success: false
        };

        let handleError = function (error) {
            console.error(error);
            res.sendStatus(500);
            throw new Error();
        };

        function uploadImgAsync(image) {
            return new Promise(function (resolve, reject) {
                cloudinary.v2.uploader.upload(image.path, {
                        width: config.image_max_resolution.width,
                        height: config.image_max_resolution.height,
                        crop: 'limit',
                        format: 'jpg'
                    },
                    (err, res) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(res);
                    });
            });
        }

        let insertRequest = function (images) {
            let query = "INSERT INTO images (id, user_id, ext, filename, width, height) VALUES ";
            let data = images.map((image) => {
                return [image.public_id,
                    req.decoded.id,
                    image.format,
                    image.original_filename,
                    image.width,
                    image.height]
            }).reduce((a, b) => {
                return a.concat(b)
            });

            // insert multiple rows in a single statement
            query += '(' + data.map(function (obj, i) {
                    return '$' + (i + 1)
                }).reduce((ar, it, i) => {
                    const ix = Math.floor(i / (data.length / images.length));
                    if (!ar[ix])
                        ar[ix] = [];
                    ar[ix].push(it);
                    return ar;
                }, []).reduce(function (a, b) {
                    return a + '), (' + b
                }) + ') RETURNING *';

            return new Promise((resolve, reject) => {
                req.pool.connect()
                    .then(client => {
                        client.query(query, data)
                            .then(result => {
                                client.release();
                                resolve(result.rows);
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

        Promise.all(req.files.map((image) => {
            return uploadImgAsync(image);
        }))
            .then(insertRequest, handleError)
            .then((responses) => {
                result.success = true;
                result.result = {photos: responses};
                return res.json(result);
            })
            .catch((error) => {
                if (error.http_code)
                    return res.sendStatus(error.http_code);
                else {
                    console.error(error);
                    return res.sendStatus(500);
                }
            });
    });

export default router;
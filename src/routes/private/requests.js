import express from 'express';
import schemas from '../../schemas';
import config from '../../config';
import gm from 'gm';
import Promise from 'bluebird';
import slug from 'slug';

const router = express.Router();

router

    // Post a request
    .post('/', function (req, res) {

        // validate user's input
        req.checkBody(schemas.request);
        let errors = req.validationErrors();
        if (errors) return res.json({ success: false, errors: errors });

        var postRequest = new Promise((resolve, reject) => {
            resolve();
        });
        postRequest
            .then(() => { return insertRequest(req) })
            .then((ret) => { return uploadImage(req, ret) })
            .then((ret) => { return updateImagePath(req, ret) })
            .then((ret) => { return res.json({ success: true, result: ret }); })
            .catch(error => {
                console.error(error);
                return res.json({ success: false, errors: [error] });
            });

        function insertRequest(req) {
            return new Promise((resolve, reject) => {
                req.pool.connect()
                    .then(client => {
                        client.query('INSERT INTO items (name, price, description, user_id) VALUES ($1, $2, $3, $4) RETURNING id, name, price, description',
                            [req.body.name, req.body.price, req.body.description, req.decoded.id])
                            .then(result => {
                                client.release();
                                resolve(result.rows[0]);
                            })
                            .catch(error => {
                                client.release();
                                reject(error);
                            });
                    }).catch(error => {
                        reject(error);
                    });
            });
        }

        function uploadImage(req, ret) {
            return new Promise((resolve, reject) => {
                Promise.promisifyAll(gm.prototype);

                // image details
                let imageName = slug(req.body.name.toLowerCase()) + ".jpg";
                let imageData = req.body.image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
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
                let image = gm(buffer);
                return image
                    .size((err, size) => {
                        if (err) reject(err);
                        if (size.width > 100 || size.height > 100)
                            image.resize(100, 100).toBuffer('jpg', (err, buff) => { buffer = buff });
                        else
                            image.resize(size.width, size.height).toBuffer('jpg', (err, buff) => { buffer = buff });
                    }).identifyAsync()
                    .then(s3.putObject(data).promise())
                    .then(() => {
                        ret.imagePath = bucket + "/" + imageName;
                        resolve(ret);
                    })
                    .catch((error) => {
                        reject(error);
                        return res.json({ success: false, errors: [{ params: "image", msg: "Unable to upload this image." }] });
                    });
            });
        }

        function updateImagePath(req, ret) {
            return new Promise((resolve, reject) => {
                req.pool.connect()
                    .then(client => {
                        client.query('UPDATE items SET image_path=$1 WHERE id=$2 AND user_id=$3',
                            [ret.imagePath, ret.id, req.decoded.id])
                            .then(result => {
                                client.release();
                                resolve(ret);
                            })
                            .catch(error => {
                                client.release();
                                reject(error);
                                return res.json({ success: false, errors: [{ params: "image", msg: "Unable to upload this image." }] });
                            });
                    }).catch(error => {
                        reject(error);
                        return res.json({ success: false, errors: [{ params: "image", msg: "Unable to upload this image." }] });
                    });
            });
        }
    });

module.exports = router;
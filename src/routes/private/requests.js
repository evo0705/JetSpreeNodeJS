import express from 'express';
import schemas from '../../schemas';
const router = express.Router();

router

    // Post a request
    .post('/', function (req, res) {

        req.checkBody(schemas.request);
        let errors = req.validationErrors();

        if (errors) {
            return res.json({ success: false, errors: errors });
        }
        // buf = new Buffer(req.body.imageBinary.replace(/^data:image\/\w+;base64,/, ""), 'base64')
        // var data = {
        //     Key: req.body.userId,
        //     Body: buf,
        //     ContentEncoding: 'base64',
        //     ContentType: 'image/jpeg'
        // };
        // s3.putObject(data, function (err, data) {
        //     if (err) {
        //         console.log(err);
        //         console.log('Error uploading data: ', data);
        //     } else {
        //         console.log('succesfully uploaded the image!');
        //     }
        // });

        req.pool.connect().then(client => {
            client.query('INSERT INTO items (name, price, description, user_id) VALUES ($1, $2, $3, $4) RETURNING id, name, price, description',
                [req.body.name, req.body.price, req.body.description, req.decoded.id])
                .then(result => {
                    client.release();
                    return res.json({ success: true, result: result.rows[0] });
                })
                .catch(error => {
                    client.release();
                    if (error) throw error;
                    return res.json({
                        success: false,
                        message: error
                    });
                })
        })
    });

module.exports = router;
import express from "express";
import kue from "kue";
const router = express.Router();

router

/* GET list of Countries */
    .get('/', function (req, res) {

        // add email queue
        let queue = kue.createQueue({
            redis: process.env.REDIS
        });
        queue.create('email', {
            subject: 'Welcome to JetSpree',
            to: 'samuel.lee@jetspree.com',
            content: 'Testing some Mailgun awesomness!',
        }).priority('high').attempts(5).removeOnComplete(true).save((error) => {
            console.error(error);
        });

        req.pool.connect().then(client => {
            client.query('SELECT * FROM countries')
                .then(result => {
                    client.release();
                    return res.json({success: true, result: result.rows});
                })
                .catch(error => {
                    client.release();
                    console.error(error);
                    return res.json({success: false, error: error});
                });
        });
    })

    .get("/img", function (req, res) {
        let s3 = new req.aws.S3({params: {Bucket: 'jetspree'}});
        s3.getObject({Key: 'dukenukem.jpg'}, function (err, file) {
            res.sendFile(file);
        });
    })

;

export default router;
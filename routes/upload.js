const express = require('express')
const router = express.Router()
const multer = require('multer');
const fs = require('fs')
const translit = require('transliteration');

require('dotenv').config();
const upload = multer({ dest: 'uploads/' });

const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
});

router.post('', upload.single('file'), function (req, res) {
    try {

        const fileContent = fs.readFileSync(req.file.path);
        const translated = translit.transliterate(req.file.originalname);
        const key = Date.now() + translated.replace(/[^\w\d\-._]/g, "").toLowerCase();
        console.log(key)
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: fileContent
        };

        s3.upload(params, function (err, data) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                console.log('File uploaded successfully to S3', data);
                res.status(200).send(data);
            }
        });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = router

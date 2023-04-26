const express = require('express')
const router = express.Router()
const multer = require('multer');
const fs = require('fs')

const upload = multer({ dest: 'uploads/' });

// AWS_BUCKET_NAME=mystery-files
// AWS_SECRET_KEY=m+f4jGHZcwW07rMK0LU/FGPPgqGoj0PbPMeLir2C
// AWS_ACCESS_KEY=AKIAWOI4T7BSZMQC4R4D
// AWS_REGION=eu-west-3
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: 'AKIAWOI4T7BSZMQC4R4D',
    secretAccessKey: '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',
    region: 'eu-west-3'
});

router.post('', upload.single('file'), function (req, res) {
    try {

        const fileContent = fs.readFileSync(req.file.path);

        const params = {
            Bucket: 'mystery-files',
            Key: req.file.originalname,
            Body: fileContent
        };

        s3.upload(params, function (err, data) {
            if (err) {
                console.log(err);
                res.status(500).send('Error uploading file to S3');
            } else {
                console.log('File uploaded successfully to S3', data);
                res.status(200).send('File uploaded successfully');
            }
        });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = router

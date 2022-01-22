const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
aws.config.loadFromPath(__dirname + '/s3.json');
const s3 = new aws.S3();
const uploadReview = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'bjclone',
        acl: 'public-read',
        key: function (req, file, cb) {
            cb(null, 'review/' + Date.now() + '.' + file.originalname.split('.').pop());
        },
    }),
    limits: { fileSize: 1000 * 1000 * 10 },
});

const uploadItem = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'bjclone',
        acl: 'public-read',
        key: function (req, file, cb) {
            cb(null, 'item/' + Date.now() + '.' + file.originalname.split('.').pop());
        },
    }),
    limits: { fileSize: 1000 * 1000 * 3 },
});

module.exports = {
    uploadReview,
    uploadItem,
};

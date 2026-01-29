const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");

// 1. Configure the S3 Client
const s3 = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

// 2. Setup Multer to stream to S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    acl: "public-read", // Makes the image link viewable by customers
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      // Create a unique filename with folder organization
      const folder = req.body.category === "Garments" ? "garments" : "cosmetics";
      cb(null, `${folder}/${Date.now().toString()}-${file.originalname}`);
    },
  }),
});

module.exports = { upload };
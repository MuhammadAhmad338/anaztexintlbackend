const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");

// Create S3 upload middleware
const createS3Upload = () => {
  const s3 = new S3Client({
    region: process.env.REGION,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY
    },
  });

  return multer({
    limits: {
      fileSize: 50 * 1024 * 1024 // 50MB
    },
    storage: multerS3({
      s3: s3,
      bucket: process.env.BUCKET_NAME,
      contentType: multerS3.AUTO_CONTENT_TYPE,

      //  acl: "public-read",
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        const folder = req.body.category === "Garments" ? "garments" : "cosmetics";
        cb(null, `${folder}/${Date.now().toString()}-${file.originalname}`);
      },
    }),
  });
};

// Export the function
module.exports = createS3Upload;

// const AWS = require("aws-sdk");
// const s3 = new AWS.S3();

// const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;

// module.exports.handler = async (event) => {
//     console.log(event);

//     const response = {
//         isBase64Encoded: false,
//         statusCode: 200,
//         body: JSON.stringify({ message: "Successfully uploaded file to S3" }),
//     };

//     try {
//         const parsedBody = JSON.parse(event.body);
//         const base64File = parsedBody.file;
//         const decodedFile = Buffer.from(base64File.replace(/^data:image\/\w+;base64,/, ""), "base64");
//         const params = {
//             Bucket: BUCKET_NAME,
//             Key: `images/${new Date().toISOString()}.jpeg`,
//             Body: decodedFile,
//             ContentType: "image/jpeg",
//         };

//         const uploadResult = await s3.upload(params).promise();

//         response.body = JSON.stringify({ message: "Successfully uploaded file to S3", uploadResult });
//     } catch (e) {
//         console.error(e);
//         response.body = JSON.stringify({ message: "File failed to upload", errorMessage: e });
//         response.statusCode = 500;
//     }

//     return response;
// };

const AWS = require('aws-sdk');
const parseMultipart = require('parse-multipart');
 
const BUCKET = process.env.BUCKET;
 
const s3 = new AWS.S3();
 
module.exports.handle = async (event) => {
  try {
    const { filename, data } = extractFile(event)
     await s3.putObject({ Bucket: BUCKET, Key: filename, ACL: 'public-read', Body: data }).promise();
 
    return {
      statusCode: 200,
      body: JSON.stringify({ link: `https://${BUCKET}.s3.amazonaws.com/${filename}` })
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.stack })
    }
  }
}
 
function extractFile(event) {
  const boundary = parseMultipart.getBoundary(event.headers['content-type'])
  const parts = parseMultipart.Parse(Buffer.from(event.body, 'base64'), boundary);
  const [{ filename, data }] = parts
 
  return {
    filename,
    data
  }
}
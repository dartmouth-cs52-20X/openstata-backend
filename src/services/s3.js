import AWS from 'aws-sdk';

const signS3 = (req, res) => {
  const s3 = new AWS.S3({ signatureVersion: 'v4', region: 'us-east-2' });
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read',
  };
  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) { res.status(422).end(); }

    const returnData = {
      signedRequest: data,
      url: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`,
    };
    return (res.json(returnData));
  });
};

export default signS3;

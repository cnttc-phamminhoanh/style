import { lambdaFunction } from '../../core/lambda'
import { LambdaFunction } from "common/types";
import { Auth } from '../../middleware/auth'
import { s3Dto } from '../../modules/s3/s3.dto';
import { S3Aws } from '../../modules/s3/s3.service';

const getPresignedUrl: LambdaFunction = async (
  event,
  context,
) => {
  const data = event.body as any
  
  const S3 = new S3Aws(
    {
      signatureVersion: 'v4',
    },
    process.env.AWS_BUCKET_NAME,
  )

  const getPresignedUrl = await S3.putSignedUrl({
    fileName: data.fileName,
    fileExtension: data.fileExtension,
    expires: 300,
  })
  
  return getPresignedUrl
}


export const handler = lambdaFunction({
  schema: s3Dto,
  handler: getPresignedUrl,
})

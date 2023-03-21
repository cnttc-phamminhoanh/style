import { S3 } from 'aws-sdk'

export interface PutSignedUrlService {
  fileName: string
  fileExtension: string
  expires?: number
}

type getDefaultUrlFunction = () => string
type getExpiresFunction = () => number

interface ClientConfiguration {
  accessKeyId?: string
  secretAccessKey?: string
  region?: string
  signatureVersion: string // v1, v2, v3, v4 < only v4 working >
}

export class S3Aws {
  private s3Bucket: S3
  constructor(
    s3Config: ClientConfiguration,
    bucket: string,
    ACL?: string,
    expires?: number,
    getDefaultUrl?: getDefaultUrlFunction,
  ) {
    this.s3Bucket = new S3(s3Config)
    this.bucket = bucket
    this.s3Config = s3Config

    if (ACL) this.ACL = ACL
    if (expires) this.expires = expires
    if (getDefaultUrl) this.getDefaultUrl = getDefaultUrl
  }

  s3Config: ClientConfiguration
  bucket: string
  ACL?: string
  // expires: second
  expires?: number

  getDefaultUrl: getDefaultUrlFunction = (): string => {
    const defaultUrl = `http://s3.${this.s3Config?.region ?? process.env.AWS_REGION}.amazonaws.com/${this.bucket}/`

    return defaultUrl
  }

  getACL: getDefaultUrlFunction = (): string => {
    const acl = this.ACL ? this.ACL : 'public-read'

    return acl
  }

  getExpires: getExpiresFunction = (): number => {
    // expires: second
    const expires = this.expires ? this.expires : 1800

    return expires
  }

  async putSignedUrl({ fileName, fileExtension, expires }: PutSignedUrlService) {
    try {

      const getDefaultUrl = this.getDefaultUrl()
      const getACL = this.getACL()
      const getExpires = expires? expires : this.getExpires()
      const s3Link = `${Date.now()}-${fileName}.${fileExtension}`

      const signedUrl = await this.s3Bucket.getSignedUrlPromise('putObject', {
        ACL: getACL,
        Bucket: this.bucket,
        Key: `${s3Link}`,
        Expires: getExpires, // expires: second
      })

      return {
        signedUrl,
        returnUrl: `${getDefaultUrl}${s3Link}`,
      }

    } catch (error) {
      return Promise.reject(error)
    }
  }
}
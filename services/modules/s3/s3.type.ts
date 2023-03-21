interface getPresignUrl {
  fileName: string;
  contentType: string;
}

export interface getPresignedUrlService {
  data: getPresignUrl;
}

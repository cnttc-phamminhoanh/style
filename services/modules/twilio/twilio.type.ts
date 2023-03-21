export interface SendVerificationService {
  readonly phoneNumber: string
}

export interface CheckVerificationService {
  code: string
  phoneNumber: string
}

export interface CheckEmailVerificationCodeService {
  code: string
  email: string
}

export interface SendSMSService {
  fromPhoneNumber: string
  phoneNumber: string
  message: string
}

export interface CheckEmailVerificationCodeService {
  code: string
  email: string
}

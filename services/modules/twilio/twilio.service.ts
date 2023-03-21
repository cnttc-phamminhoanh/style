import {
  SendVerificationService,
  CheckVerificationService,
  SendSMSService,
  CheckEmailVerificationCodeService,
} from './twilio.type'
import Twilio from 'twilio'
import { twilioError } from './twilio.constants'

export class TwilioService {
  private twilioClient = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

  async sendVerificationCodeToPhoneNumber({ phoneNumber }: SendVerificationService): Promise<boolean> {
    try {
      if (process.env.NODE_ENV !== 'production') {
        return true
      }

      const verificationRequest = await this.twilioClient.verify.services(process.env.TWILIO_PHONE_NUMBER_SERVICE_SID)
        .verifications
        .create({ to: phoneNumber, channel: 'sms' })

      if (!verificationRequest) {
        return Promise.reject({
          name: 'PhoneNumberInvalid',
          code: 400,
        })
      }

      return true
    } catch (error) {
      const errorDetail = this.getError(error)
      return Promise.reject(errorDetail)
    }
  }

  // check code for number phone
  async checkPhoneVerificationCode({ code, phoneNumber }: CheckVerificationService): Promise<boolean> {
    try {
      const nodeEnv = process.env.NODE_ENV

      // allow developer use code = 9999 to verify in development and local environment
      if (nodeEnv !== 'production' && code === '999999') {
        return true
      }

      const verificationResult = await this.twilioClient.verify.services(process.env.TWILIO_PHONE_NUMBER_SERVICE_SID)
        .verificationChecks
        .create({ code, to: phoneNumber })

      if (!verificationResult || verificationResult.status !== 'approved') {
        return Promise.reject({
          name: 'VerificationCodeIncorrect',
          code: 400,
        })
      }

      return true
    } catch (error) {
      const errorDetail = this.getError(error)
      return Promise.reject(errorDetail)
    }
  }

  async sendVerificationCodeToEmail({ email }: { email: string }): Promise<boolean> {
    try {
      if (process.env.NODE_ENV !== 'production') {
        return true
      }

      await this.twilioClient.verify.services(process.env.TWILIO_EMAIL_SERVICE_SID)
        .verifications
        .create({
          to: email, channel: 'email',
        })

      return true
    } catch (error) {
      const errorDetail = this.getError(error)
      return Promise.reject(errorDetail)
    }
  }

  // check code for email
  async checkEmailVerificationCode({ code, email }: CheckEmailVerificationCodeService): Promise<boolean> {
    try {
      const nodeEnv = process.env.NODE_ENV

      // allow developer use code = 9999 to verify in development and local environment
      if (nodeEnv !== 'production' && code === '999999') {
        return true
      }

      const verificationResult = await this.twilioClient.verify.services(process.env.TWILIO_EMAIL_SERVICE_SID)
        .verificationChecks
        .create({
          to: email, code,
        })

      if (!verificationResult || verificationResult.valid !== true) {
        return Promise.reject({
          name: 'VerificationCodeIncorrect',
          code: 400,
        })
      }

      return true
    } catch (error) {
      const errorDetail = this.getError(error)
      return Promise.reject(errorDetail)
    }
  }

  async sendSMS({ message, phoneNumber, fromPhoneNumber }: SendSMSService): Promise<boolean> {
    try {
      const nodeEnv = process.env.NODE_ENV
      const recepientPhoneNumber = nodeEnv !== 'production' ? process.env.TWILIO_TESTING_NUMBER : phoneNumber

      if (nodeEnv === 'test') {
        return true
      }

      await this.twilioClient.messages.create({
        messagingServiceSid: process.env.TWILIO_MESSAGE_SID,
        body: message,
        to: recepientPhoneNumber, // Text this number
        from: `+${fromPhoneNumber}`, // From a valid Twilio number
      })

      return true
    } catch (error) {
      const errorDetail = this.getError(error)
      return Promise.reject(errorDetail)
    }
  }

  getError(error) {
    const errorDetail = twilioError[error.code]

    if (!errorDetail) {
      return {
        ...error,
        name: 'TwilioError',
      }
    }

    return {
      message: errorDetail,
      code: error.code,
      name: 'TwilioError',
    }
  }
}

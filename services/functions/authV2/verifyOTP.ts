import { LambdaFunction } from "../../common/types"
import { IVerifyOTPResult, NextAction, UserStatus } from "../../modules/users/users.type"
import * as Jwt from 'jsonwebtoken'
import { lambdaFunction } from "../../core/lambda"
import { verifyOTPV2Dto } from "../../modules/users/users.dto"
import { Auth } from '../../middleware/auth'
import { TwilioService } from "../../modules/twilio/twilio.service"

const verifyOTP: LambdaFunction = async (
  event,
  context,
): Promise<IVerifyOTPResult> => {
  const { user, body } = event as any
  const twilioService = new TwilioService()
  let accessToken

  // verify otp code
  await twilioService.checkPhoneVerificationCode({
    code: body.code,
    phoneNumber: user.phoneNumber
  })

  if (user?.status === UserStatus.ACTIVE) {
    accessToken = Jwt.sign(
      {
        userId: user?.userId,
        phoneNumber: user?.phoneNumber,
        status: user?.status
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '90d'
      }
    )

    return {
      accessToken,
    }
  }

  accessToken = Jwt.sign(
    {
      userId: user?.userId,
      phoneNumber: user?.phoneNumber,
      status: user?.status
    },
    process.env.JWT_SECRET_SIGN_UP,
    {
      expiresIn: '1h'
    }
  )

  return {
    accessToken,
    nextAction: NextAction.SIGNUP
  }
}

export const handler = lambdaFunction({
  schema: verifyOTPV2Dto,
  preHandlers: [
    new Auth(process.env.OTP_JWT_SECRET as string).jwt
  ],
  handler: verifyOTP
})

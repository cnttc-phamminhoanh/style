import { LambdaFunction } from "common/types"
import { UsersService } from "modules/users/users.service"
import { UserStatus } from "modules/users/users.type"
import * as Jwt from 'jsonwebtoken'
import { lambdaFunction } from "core/lambda"
import { verifyOTPDto } from "modules/users/users.dto"
import { Auth } from '../../middleware/auth'
import { TwilioService } from "../../modules/twilio/twilio.service"

const verifyOTP: LambdaFunction = async (
  event,
  context,
): Promise<{ accessToken: string }> => {
  const { user, body } = event as any
  const twilioService = new TwilioService()

  // verify otp code
  await twilioService.checkPhoneVerificationCode({
    code: body.code,
    phoneNumber: user.phoneNumber
  })

  if (user?.status === UserStatus.INACTIVE) {

    const userService = new UsersService()

    // active user
    await userService.update({
      query: { userId: user.userId },
      data: { status: UserStatus.ACTIVE }
    })
  }

  const accessToken = Jwt.sign(
    {
      userId: user?.userId,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
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

export const handler = lambdaFunction({
  schema: verifyOTPDto,
  preHandlers: [
    new Auth(process.env.OTP_JWT_SECRET as string).jwt
  ],
  handler: verifyOTP
})

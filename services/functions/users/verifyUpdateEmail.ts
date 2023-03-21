import { lambdaFunction } from '../../core/lambda'
import { LambdaFunction } from "common/types"
import { UsersService } from "../../modules/users/users.service"
import { Auth } from '../../middleware/auth'
import { verifyOTPDto } from "../../modules/users/users.dto"
import { TwilioService } from "../../modules/twilio/twilio.service"

const verifyForUpdatingEmail: LambdaFunction = async (
  event,
  context,
) => {
  const { user, body } = event as any
  const twilioService = new TwilioService()
  const userService = new UsersService()

  // verify otp code
  await twilioService.checkEmailVerificationCode({
    code: body.code,
    email: user.email
  })

  return await userService.update({
    query: { userId: user.userId },
    data: { email: user?.email }
  })
}

export const handler = lambdaFunction({
  schema: verifyOTPDto,
  preHandlers: [
    new Auth(process.env.OTP_JWT_SECRET as string).jwtUpdateEmail
  ],
  handler: verifyForUpdatingEmail,
})
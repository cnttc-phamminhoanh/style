import { loginDto } from "../../modules/users/users.dto";
import { UsersService } from "../../modules/users/users.service";
import { TwilioService } from '../../modules/twilio/twilio.service'
import { UserStatus } from "../../modules/users/users.type";
import * as Jwt from 'jsonwebtoken'
import { lambdaFunction } from '../../core/lambda'
import { LambdaFunction } from "common/types";


const login: LambdaFunction = async (
  event,
  context,
) => {
  const data = event.body as any
  const { phoneNumber } = data
  const userService = new UsersService()
  const twilioService = new TwilioService()

  const user = await userService.findOne({
    query: {
      phoneNumber,
      status: UserStatus.ACTIVE,
    }
  })

  // send verification code to phoneNumber
  await twilioService.sendVerificationCodeToPhoneNumber({
    phoneNumber
  })

  const accessToken = Jwt.sign(
    {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      status: user.status
    },
    process.env.OTP_JWT_SECRET,
    {
      expiresIn: '1h'
    }
  )

  return {
    accessToken,
  }
}


export const handler = lambdaFunction({
  schema: loginDto,
  handler: login,
})

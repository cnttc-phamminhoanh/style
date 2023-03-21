import { loginWithPhoneNumberDto } from "../../modules/users/users.dto";
import { UsersService } from "../../modules/users/users.service";
import { TwilioService } from '../../modules/twilio/twilio.service'
import { ILoginOrSignUpResult, UserStatus } from "../../modules/users/users.type";
import * as Jwt from 'jsonwebtoken'
import { lambdaFunction } from '../../core/lambda'
import { LambdaFunction } from "../../common/types";

const loginWithPhoneNumber: LambdaFunction = async (
  event,
  context,
): Promise<ILoginOrSignUpResult> => {
  const data = event.body as any
  const { phoneNumber } = data
  const userService = new UsersService()
  const twilioService = new TwilioService()
  let user

  user = await userService.findOne({
    query: {
      phoneNumber
    },
    checkExist: false
  })

  if (!user) {
    user = await userService.create({
      data: { phoneNumber, status: UserStatus.INACTIVE }
    })
  }

  // send verification code to phoneNumber
  await twilioService.sendVerificationCodeToPhoneNumber({
    phoneNumber
  })

  const accessToken = Jwt.sign(
    {
      userId: user.userId,
      phoneNumber: user.phoneNumber,
      status: user.status
    },
    process.env.OTP_JWT_SECRET,
    {
      expiresIn: '1h'
    }
  )

  return {
    accessToken
  }
}

export const handler = lambdaFunction({
  schema: loginWithPhoneNumberDto,
  handler: loginWithPhoneNumber
})

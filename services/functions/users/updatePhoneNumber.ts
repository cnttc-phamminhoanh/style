import { lambdaFunction } from '../../core/lambda'
import { LambdaFunction } from "common/types"
import { Users } from '../../modules/users/users.entity'
import { TwilioService } from "../../modules/twilio/twilio.service"
import * as Jwt from 'jsonwebtoken'
import { Auth } from '../../middleware/auth'
import { updatePhoneNumberDto } from "../../modules/users/users.dto"
import { UsersService } from '../../modules/users/users.service'
import { Not } from 'typeorm'

const updatePhoneNumber: LambdaFunction =  async (
    event,
    context,
  ): Promise<{ accessToken: string }> => {
    const data = event.body as any
    const user = event.user as Users

    const userService = new UsersService()
    const twilioService = new TwilioService()

    if (data.newPhoneNumber === user.phoneNumber) {
      throw {
        code: 400,
        name: 'OldPhoneNumber'
      }
    }

    const existingUser = await userService.findOne({
      query: {
        phoneNumber: data.newPhoneNumber,
        userId: Not(user.userId),
      },
      checkExist: false
    })

    if (existingUser) {
      throw {
        code: 400,
        name: 'PhoneNumberAlreadyUsed'
      }
    }
  
    await twilioService.sendVerificationCodeToPhoneNumber({
      phoneNumber: data.newPhoneNumber
    })
  
    const accessToken = Jwt.sign(
      {
        userId: user?.userId,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        phoneNumber: data?.newPhoneNumber,
        status: user?.status
      },
      process.env.OTP_JWT_SECRET as string,
      {
        expiresIn: '1h'
      }
    )

    return {
      accessToken,
    }
  }
  
  export const handler = lambdaFunction({
    schema: updatePhoneNumberDto,
    preHandlers: [
      new Auth(process.env.JWT_SECRET as string).jwt
    ],
    handler: updatePhoneNumber
  })
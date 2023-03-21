import { UsersService } from "../../modules/users/users.service";
import * as Jwt from 'jsonwebtoken'
import { UserStatus } from "../../modules/users/users.type";
import { LambdaFunction, UserType } from "../../common/types";
import { lambdaFunction } from "../../core/lambda";
import { singUpDto } from "../../modules/users/users.dto";
import { TwilioService } from "../../modules/twilio/twilio.service";
import { PermissionsService } from "../../modules/permissions/permissions.service";
import { PermissionStatus, RoleName } from "../../modules/permissions/permissions.type";
import { StylistsServices } from "../../modules/stylists/stylists.service";
import { CustomersService } from "modules/customers/customers.service";
import { StripesService } from "modules/stripes/stripes.service";

const signUp: LambdaFunction =  async (
  event,
  context,
): Promise<{ accessToken: string }> => {
  const data = event.body as any

  const userService = new UsersService()
  const twilioService = new TwilioService()
  const { userType } = data
  const permissionService = new PermissionsService()
  const stylistService = new StylistsServices()
  const customerService = new CustomersService()
  const stripesService = new StripesService()

  const existingUser = await userService.findOne({
    query: { phoneNumber: data.phoneNumber },
    checkExist: false
  })

  if (existingUser && existingUser.status === UserStatus.ACTIVE) {
    throw {
      code: 400,
      name: 'PhoneNumberAlreadyUsed'
    }
  }

  // send verification code to phoneNumber
  await twilioService.sendVerificationCodeToPhoneNumber({
    phoneNumber: data.phoneNumber
  })

  let newUser

  const mapData = {
    ...data,
    address: data?.location?.address,
    latitude: data?.location?.latitude,
    longitude: data?.location?.longitude,
  }

  delete mapData?.location
  delete mapData?.userType

  if (existingUser) {
    newUser = await userService.update({
      query: { userId: existingUser.userId },
      data: mapData,
    })
  }

  if (!existingUser) {
    newUser = await userService.create({
      data: {
        ...mapData,
        status: UserStatus.INACTIVE
      },
    })

    if (userType === UserType.CUSTOMER) {

      const stripeCustomerId = await stripesService.createCustomer({
        data: {
          phoneNumber: newUser.phoneNumber,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName
        }
      })

      await Promise.all([
        permissionService.create({
          data: {
            roleName: RoleName.CUSTOMER,
            status: PermissionStatus.ACTIVE,
            userId: newUser.userId
          }
        }),
        customerService.create({
          data: {
            customerId: newUser.userId,
            stripeCustomerId
          }
        })
      ])
    }

    if (!userType || userType === UserType.STYLIST) {
      await Promise.all([
        permissionService.create({
          data: {
            roleName: RoleName.STYLIST,
            status: PermissionStatus.PENDING,
            userId: newUser.userId
          }
        }),
        stylistService.createOneStylist({
          data: {
            stylistId: newUser.userId 
          }
        })
      ])
    }
  }

  const accessToken = Jwt.sign(
    {
      userId: newUser?.userId,
      firstName: newUser?.firstName,
      lastName: newUser?.lastName,
      email: newUser?.email,
      phoneNumber: newUser?.phoneNumber,
      status: newUser?.status
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
  schema: singUpDto,
  handler: signUp
})
import { UsersService } from "../../modules/users/users.service";
import * as Jwt from 'jsonwebtoken'
import { UserStatus } from "../../modules/users/users.type";
import { LambdaFunction } from "../../common/types";
import { lambdaFunction } from "../../core/lambda";
import { PermissionsService } from "../../modules/permissions/permissions.service";
import { PermissionStatus, RoleName } from "../../modules/permissions/permissions.type";
import { CustomersService } from "../../modules/customers/customers.service";
import { StripesService } from "../../modules/stripes/stripes.service";
import { Auth } from "../../middleware/auth";
import { customerSingUpDto } from "../../modules/customers/customers.dto";
import { ICustomerSignUpResult } from "../../modules/customers/customers.type";
import { PaymentMethodsService } from "../../modules/paymentMethods/paymentMethods.service";
import { PaymentMethodsType } from "../../modules/paymentMethods/paymentMethods.type";

const customerSignUp: LambdaFunction =  async (
  event,
  context,
): Promise<ICustomerSignUpResult> => {
  const data = event.body as any
  const userService = new UsersService()
  const permissionService = new PermissionsService()
  const customerService = new CustomersService()
  const stripesService = new StripesService()
  const paymentMethodsService = new PaymentMethodsService()
  const { maximumDistance, hairType, preferredStyle, location, paymentMethod, ...newData } = data

  if (event.user?.status === UserStatus.ACTIVE) {
    throw {
      code: 401,
      name: 'Invalid token, token revoked'
    }
  }

  const mapData = {
    ...newData,
    address: location?.address,
    latitude: location?.latitude,
    longitude: location?.longitude,
  }

  const user = await userService.update({
    query: { userId: event.user?.userId },
    data: {
      ...mapData,
      status: UserStatus.ACTIVE
    }
  })

  const stripeCustomerId = await stripesService.createCustomer({
    data: {
      phoneNumber: user.phoneNumber,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    }
  })

  const [ card, customer ] = await Promise.all([
    stripesService.createCustomerCardMethod({
      data: {
        ...paymentMethod,
        stripeCustomerId
      }
    }) as any,
    customerService.create({
      data: {
        customerId: user.userId,
        stripeCustomerId,
        maximumDistance,
        hairType,
        preferredStyle
      }
    }),
    permissionService.create({
      data: {
        roleName: RoleName.CUSTOMER,
        status: PermissionStatus.ACTIVE,
        userId: user.userId
      }
    })
  ])

  await paymentMethodsService.createPaymentMethods({
    data: {
      customerId: customer.customerId,
      stripePaymentMethodId: card.id,
      type: PaymentMethodsType.CARD,
      cardHolderName: card.name,
      lastFourNumbers: card.last4
    }
  })

  const accessToken = Jwt.sign(
    {
      userId: user?.userId,
      phoneNumber: user?.phoneNumber,
      status: user?.status,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '90d'
    }
  )

  return {
    accessToken
  }
}

export const handler = lambdaFunction({
  schema: customerSingUpDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET_SIGN_UP as string).jwt
  ],
  handler: customerSignUp
})
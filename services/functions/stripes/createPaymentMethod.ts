import { LambdaFunction } from "common/types";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from "../../middleware/auth";
import { checkRole } from "../../middleware/authz";
import { RoleName } from "../../modules/permissions/permissions.type";
import { StripesService } from "modules/stripes/stripes.service";
import { createPaymentMethodDto } from "modules/paymentMethods/paymentMethods.dto";
import { CustomersService } from "modules/customers/customers.service";
import { PaymentMethodsService } from "modules/paymentMethods/paymentMethods.service";
import { PaymentMethodsType } from "modules/paymentMethods/paymentMethods.type";
import { PaymentMethods } from "modules/paymentMethods/paymentMethods.entity";
import { Users } from "modules/users/users.entity";

const createPaymentMethod: LambdaFunction = async (
  event,
  context
): Promise<PaymentMethods> => {
  const customersService = new CustomersService()
  const paymentMethodsService = new PaymentMethodsService()
  const stripesService = new StripesService()
  const body = event.body as any
  const user = event.user as Users

  const customer = await customersService.getOrCreateOneCustomer(user.userId)
  let stripeCustomerId = customer.stripeCustomerId

  if (!stripeCustomerId) {
    stripeCustomerId = await stripesService.createCustomer({
      data: {
        phoneNumber: user.phoneNumber,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    })

    await customersService.updateCustomer({
      query: { customerId: customer.customerId },
      data: { stripeCustomerId }
    })
  }

  const card = await stripesService.createCustomerCardMethod({
    data: { ...body, stripeCustomerId }
  }) as any

  const newPaymentMethod = await paymentMethodsService.createPaymentMethods({
    data: {
      customerId: customer.customerId,
      stripePaymentMethodId: card.id,
      type: PaymentMethodsType.CARD,
      cardHolderName: card.name,
      lastFourNumbers: card.last4
    }
  })

  return newPaymentMethod
}

export const handler = lambdaFunction({
  schema: createPaymentMethodDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.CUSTOMER]),
  ],
  handler: createPaymentMethod,
});

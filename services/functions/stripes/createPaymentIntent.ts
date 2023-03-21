import { LambdaFunction } from "../../common/types";
import { RoleName } from "../../modules/permissions/permissions.type";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from "../../middleware/auth";
import { checkRole } from "../../middleware/authz";
import { createPaymentIntentDto } from "../../modules/paymentIntents/paymentIntents.dto";
import { CustomersService } from "../../modules/customers/customers.service";
import { PaymentMethodsService } from "../../modules/paymentMethods/paymentMethods.service";
import { ConnectedAccountService } from "../../modules/connectedAccounts/connectedAccounts.service";
import { ConnectedAccountsStatus } from "../../modules/connectedAccounts/connectedAccounts.type";
import { Payments } from "../../modules/payments/payments.entity";
import { AppointmentCombinedService } from "modules/appointments/appointment.combined.service";
import { PaymentsCombinedService } from "modules/payments/payments.combined.service";
import { Currency } from "modules/paymentIntents/paymentIntent.type";

const createPaymentIntent: LambdaFunction = async (
  event,
  context
): Promise<Payments> => {
  const {
    appointmentId,
    currency,
    discount = 0,
    description = '',
    paymentMethodId,
    tip = 0,
    sender,
    receiver,
    amount,
  } = event.body as any

  const credentials = event.user

  const customersService = new CustomersService()
  const paymentMethodsService = new PaymentMethodsService()
  const connectedAccountService = new ConnectedAccountService()
  const appointmentCombinedService = new AppointmentCombinedService()
  const paymentsCombinedService = new PaymentsCombinedService()


  // If not have amount in body then calculation amount from appointmentServices
  if (appointmentId) {
    const {
      amount: appointmentPaymentAmount,
      connectedAccount: appointmentConnectedAccount,
      paymentMethod: appointmentPaymentMethod,
      customerId: appointmentCustomerId,
    } = await appointmentCombinedService.validateAppointmentPayment({
      appointmentId,
      paymentMethodId,
      credentials,
    })

    const appointmentCustomer = await customersService.findOneCustomer({
      query: {
        customerId: appointmentCustomerId,
      }
    })

    const appointmentPayment = await paymentsCombinedService.createPayment({
      credentials,
      data: {
        amount: appointmentPaymentAmount,
        connectedAccount: appointmentConnectedAccount,
        currency: Currency.USD,
        customer: appointmentCustomer,
        paymentMethod: appointmentPaymentMethod,
        appointmentId,
        description,
        discount,
        tip,
      }
    })

    return appointmentPayment
  }

  const customerId = sender ?? credentials.userId

  const [customer, paymentMethod, connectedAccount] = await  Promise.all([
    customersService.findOneCustomer({
      query: {
        customerId,
      }
    }),
    paymentMethodsService.findOnePaymentMethod({
      query: {
        paymentMethodId,
        customerId
      },
      credentials: event.user,
    }),
    connectedAccountService.findOneConnectedAccount({
      query: {
        stylistId: receiver,
      }
    }),
  ])

  if (connectedAccount.status !== ConnectedAccountsStatus.ACTIVE) {
    throw {
      code: 400,
      name: 'ConnectAccountIsNotActive'
    }
  }

  const payment = await paymentsCombinedService.createPayment({
    credentials: event.user,
    data: {
      amount,
      connectedAccount,
      currency,
      customer,
      paymentMethod,
      description,
      discount,
      tip,
    }
  })

  return payment
}

export const handler = lambdaFunction({
  schema: createPaymentIntentDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.CUSTOMER, RoleName.ADMIN]),
  ],
  handler: createPaymentIntent,
});

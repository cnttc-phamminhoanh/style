import { LambdaFunction } from "../../common/types";
import { RoleName } from "../../modules/permissions/permissions.type";
import { lambdaFunction } from "../../core/lambda";
import { PaymentsService } from "../../modules/payments/payments.service";
import { StripesService } from "../../modules/stripes/stripes.service";
import { Auth } from "../../middleware/auth";
import { checkRole } from "../../middleware/authz";
import { PaymentStatus } from "../../modules/payments/payments.type";
import { TransactionsService } from "../../modules/transactions/transactions.service";
import { TransactionsType } from "../../modules/transactions/transactions.type";
import { Payments } from "../../modules/payments/payments.entity";

const confirmPaymentIntent: LambdaFunction = async (
  event,
  context
): Promise<Payments> => {
  const { paymentId } = event.pathParameters
  const { userId } = event.user

  const paymentService = new PaymentsService()
  const transactionService = new TransactionsService()
  const stripeService = new StripesService()

  const payment = await paymentService.findOnePayment({
    query: {
      paymentId,
    },
    credentials: event.user,
  })

  if (payment.createdBy !== userId) {
    throw {
      code: 403,
      name: `You don't have permission to confirm this payment`
    }
  }

  if (payment.status !== PaymentStatus.PENDING) {
    throw {
      code: 400,
      name: `Payment was ${payment.status.toLowerCase()}`
    }
  }

  const transaction = await transactionService.findOneTransaction({
    query: {
      paymentId: payment.paymentId,
      type: TransactionsType.PAYMENT,
    },
    credentials: event.user
  })

  // Call to stripe api for confirm paymentIntent
  await stripeService.confirmPaymentIntent({
    data: {
      stripePaymentIntentId: transaction.stripePaymentId,
    }
  })

  return payment
}

export const handler = lambdaFunction({
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.CUSTOMER]),
  ],
  handler: confirmPaymentIntent,
});
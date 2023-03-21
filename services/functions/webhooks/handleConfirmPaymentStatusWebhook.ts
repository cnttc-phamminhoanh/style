import { StripesService } from "../../modules/stripes/stripes.service";
import { LambdaFunction } from "../../common/types";
import { lambdaFunction } from "../../core/lambda";
import { StripeTypeOfEvent } from "modules/stripes/stripes.type";
import { TransactionsService } from "../../modules/transactions/transactions.service";
import { TransactionsType } from "modules/transactions/transactions.type";
import { handleWhenPaymentIntentSucceeded } from "./handles/handleWhenPaymentIntentSucceeded";
import { handleWhenPaymentIntentFailed } from "./handles/handleWhenPaymentIntentFailed";
import { handleWhenPaymentIntentCanceled } from "./handles/handleWhenPaymentIntentCanceled";
import { handleWhenHaveNextAction } from "./handles/handleWhenHaveNextAction";

const handleConfirmPaymentStatusWebhook: LambdaFunction = async (
  event,
  context
): Promise<any> => {
  const signature = event.headers['stripe-signature'];
  const body = event.body

  const stripeService = new StripesService()
  const transactionService = new TransactionsService()

  const constructEvent = await stripeService.constructEvent({
    data: {
      body,
      signature,
    }
  }) as any

  const data = constructEvent.data
  const eventType = constructEvent.type
  const nextAction = data?.next_action

  if (!data || !eventType) {

    return
  }

  const transaction = await transactionService.findOneTransaction({
    query: {
      stripePaymentId: data?.object?.id,
      type: TransactionsType.PAYMENT,
    },
    credentials: {
      isPublic: true,
    } as any
  })

  if (nextAction) {
    await handleWhenHaveNextAction({
      data: {
        transaction,
        nextAction: JSON.stringify(nextAction),
      }
    })

    return
  }

  switch (eventType) {
    case StripeTypeOfEvent.PAYMENT_INTENT_SUCCEEDED:
      // Update status transaction, status payment and create new transactionLog
      await handleWhenPaymentIntentSucceeded(transaction)
      break;

    case StripeTypeOfEvent.PAYMENT_INTENT_FAILED:
      // Update status transaction, status payment and create new transactionLog
      await handleWhenPaymentIntentFailed(transaction)
      break;

    case StripeTypeOfEvent.PAYMENT_INTENT_CANCELED:
      // Update status transaction, status payment and create new transactionLog
      await handleWhenPaymentIntentCanceled(transaction)
      break;

    default:
      break;
  }
}

export const handler = lambdaFunction({
  handler: handleConfirmPaymentStatusWebhook,
});
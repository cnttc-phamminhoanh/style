import { TransactionsStatus } from "../../../modules/transactions/transactions.type"
import { TransactionsService } from "../../../modules/transactions/transactions.service"
import { PaymentsService } from "../../../modules/payments/payments.service"
import { PaymentStatus } from "../../../modules/payments/payments.type"
import { Transactions } from "../../../modules/transactions/transactions.entity"
import { TransactionLogsService } from "../../../modules/transactionLogs/transactionLogs.service"
import { TransactionLogsType } from "../../../modules/transactionLogs/transactionLogs.type"

export const handleWhenPaymentIntentFailed = async (transaction: Transactions) => {
  if (!transaction) {
    return
  }

  const transactionService = new TransactionsService()
  const paymentService = new PaymentsService()
  const transactionLogServices = new TransactionLogsService()

  await Promise.all([
    transactionService.updateTransaction({
      query: {
        transactionId: transaction.transactionId,
      },
      data: {
        status: TransactionsStatus.FAILED,
      },
      credentials: {
        isPublic: true,
      } as any
    }),
    paymentService.updatePayment({
      query: {
        paymentId: transaction.paymentId,
      },
      data: {
        status: PaymentStatus.FAILED,
      },
      credentials: {
        isPublic: true,
      } as any
    }),
    transactionLogServices.createTransactionLog({
      data: {
        content: `Transaction ${transaction.transactionId} failed`,
        transactionId: transaction.transactionId,
        grossAmount: transaction.grossAmount,
        netAmount: transaction.netAmount,
        fee: transaction.fee,
        type: TransactionLogsType.CREATED,
        currency: transaction.currency,
      }
    }),
  ])
}
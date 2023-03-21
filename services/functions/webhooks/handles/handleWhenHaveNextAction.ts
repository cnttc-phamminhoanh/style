import { TransactionsService } from "../../../modules/transactions/transactions.service"
import { Transactions } from "../../../modules/transactions/transactions.entity"
import { TransactionLogsService } from "../../../modules/transactionLogs/transactionLogs.service"
import { TransactionLogsType } from "../../../modules/transactionLogs/transactionLogs.type"

interface IHandleWhenHaveNextActionData {
  transaction: Transactions,
  nextAction: string
}

interface IHandleWhenHaveNextAction {
  data: IHandleWhenHaveNextActionData
}

export const handleWhenHaveNextAction = async ({ data }: IHandleWhenHaveNextAction) => {
  const { transaction } = data

  if (!transaction) {
    return
  }

  const transactionService = new TransactionsService()
  const transactionLogServices = new TransactionLogsService()

  await Promise.all([
    transactionService.updateTransaction({
      query: {
        transactionId: transaction.transactionId,
      },
      data: {
        nextActions: data.nextAction,
      },
      credentials: {
        isPublic: true,
      } as any
    }),
    transactionLogServices.createTransactionLog({
      data: {
        content: `You need to do the steps in nextAction first to pay`,
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
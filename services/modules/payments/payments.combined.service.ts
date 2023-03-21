import { StripesService } from "modules/stripes/stripes.service"
import { TransactionLogsService } from "modules/transactionLogs/transactionLogs.service"
import { TransactionLogsType } from "modules/transactionLogs/transactionLogs.type"
import { TransactionsService } from "modules/transactions/transactions.service"
import { TransactionsStatus, TransactionsType } from "modules/transactions/transactions.type"
import { calculatePaymentAmount } from "./helpers"
import { PaymentsService } from "./payments.service"
import { CreatePaymentProps } from "./payments.type"

export class PaymentsCombinedService {
  private readonly stripeService
  private readonly paymentsService
  private readonly transactionServices
  private readonly transactionLogServices

  constructor() {
    this.stripeService = new StripesService()
    this.paymentsService = new PaymentsService()
    this.transactionServices = new TransactionsService()
    this.transactionLogServices = new TransactionLogsService()
  }

  async createPayment({
    data,
    credentials,
  }: CreatePaymentProps) {
    const {
      amount,
      discount,
      tip,
      currency,
      paymentMethod,
      customer,
      connectedAccount,
      description,
      appointmentId,
    } = data

    // calculate payment amount
    const { grossAmount, netAmount, fee } = calculatePaymentAmount({
      amount,
      discount,
      tip,
    })

    // Call to stripe api for create paymentIntent
    const paymentIntent = await this.stripeService.createPaymentIntent({
      data: {
        amount: netAmount,
        currency,
        paymentMethod: paymentMethod.stripePaymentMethodId,
        customer: customer.stripeCustomerId,
        transferData: {
          destination: connectedAccount.stripeConnectedAccountId,
        },
        description,
        fee,
      }
    })

    // Create new payment with status PENDING in database
    const newPayment = await this.paymentsService.createPayment({
      data: {
        createdBy: credentials.userId,
        sender: customer.customerId,
        receiver: connectedAccount.stylistId,
        grossAmount,
        netAmount,
        appointmentId,
        description,
        fee,
        discount,
        currency,
        tip,
      }
    })

    // Create new transaction with status PENDING in database
    const newTransaction = await this.transactionServices.createTransaction({
      data: {
        paymentId: newPayment.paymentId,
        status: TransactionsStatus.PENDING,
        stripePaymentId: paymentIntent.id,
        sender: customer.customerId,
        receiver: connectedAccount.stylistId,
        grossAmount,
        netAmount,
        fee,
        createdBy: credentials.userId,
        type: TransactionsType.PAYMENT,
        currency,
      }
    })

    // Create new transactionLog in database
    await this.transactionLogServices.createTransactionLog({
      data: {
        content: `Transaction ${newTransaction.transactionId} has been created`,
        transactionId: newTransaction.transactionId,
        grossAmount,
        netAmount,
        fee,
        type: TransactionLogsType.CREATED,
        currency,
      }
    })

    return newPayment
  }
}
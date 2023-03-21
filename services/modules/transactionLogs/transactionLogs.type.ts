import { Currency, ZeroDecimalCurrencies } from "../../modules/paymentIntents/paymentIntent.type"

export enum TransactionLogsType {
  CREATED = "CREATED",
  DELETED = "DELETED",
  UPDATED = "UPDATED",
  ERROR = "ERROR"
}

interface ICreateTransactionLogData {
  content?: string
  transactionId: string
  grossAmount: number
  netAmount: number
  fee: number
  type: TransactionLogsType
  currency: Currency | ZeroDecimalCurrencies
}

export interface ICreateTransactionLogService {
  data: ICreateTransactionLogData
}
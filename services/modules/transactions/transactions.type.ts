import { Currency, ZeroDecimalCurrencies } from "../../modules/paymentIntents/paymentIntent.type"
import { Credentials, SortDirection } from "../../common/types"
import { Users } from "../../modules/users/users.entity"
import { Transactions } from "./transactions.entity"

export enum TransactionsStatus {
  PENDING = 'PENDING',
  SUCCEED = 'SUCCEED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
  CANCELED = 'CANCELED'
}

export enum TransactionsType {
  PAYMENT = 'PAYMENT',
  PAYMENT_REFUND = 'PAYMENT_REFUND',
  CHARGE = 'CHARGE',
  REFUND = 'REFUND',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED'
}

interface ICreateTransactionData {
  description?: string
  paymentId: string
  status: TransactionsStatus
  stripePaymentId: string
  createdBy: string
  sender: string
  receiver: string
  grossAmount: number
  netAmount: number
  fee: number
  type: TransactionsType
  currency: Currency | ZeroDecimalCurrencies
}

export interface ICreateTransactionService {
  data: ICreateTransactionData
}

interface IUpdateTransactionQuery {
  transactionId: string
}

interface IUpdateTransactionData {
  status?: TransactionsStatus
  nextActions?: string
}

export interface IUpdateTransactionService {
  query: IUpdateTransactionQuery
  data: IUpdateTransactionData
  credentials: Credentials | Users
}

interface IFindOneTransactionQuery {
  paymentId?: string
  type?: TransactionsType
  stripePaymentId?: string
  transactionId?: string
}

export interface IFindOneTransactionService {
  query: IFindOneTransactionQuery
  credentials: Credentials | Users
}

export enum TransactionsSortBy {
  GROSS_AMOUNT = 'grossAmount',
  NET_AMOUNT = 'netAmount',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

interface IFindManyTransactionsQuery {
  paymentId?: string
  fromGrossAmount?: number
  toGrossAmount?: number
  fromNetAmount?: number
  toNetAmount?: number
  type?: TransactionsType
  status?: TransactionsStatus
  sender?: string
  receiver?: string

  sortBy?: TransactionsSortBy
  sortDirection?: SortDirection
  limit?: number
  offset?: number
}

export interface IFindManyTransactionsService {
  query: IFindManyTransactionsQuery
  credentials: Credentials
  relations?: string[]
}

export interface IFindManyTransactionsResult {
  list: Transactions[]
  totalCount: number
}
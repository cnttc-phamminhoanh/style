import { Currency, ZeroDecimalCurrencies } from "../../modules/paymentIntents/paymentIntent.type"
import { Credentials, SortDirection } from "../../common/types"
import { Users } from "../../modules/users/users.entity"
import { Payments } from "./payments.entity"
import { PaymentMethods } from "modules/paymentMethods/paymentMethods.entity"
import { Customers } from "modules/customers/customers.entity"
import { ConnectedAccounts } from "modules/connectedAccounts/connectedAccounts.entity"

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELED = 'CANCELED',
  FAILED = 'FAILED'
}

interface ICreatePaymentData {
  discount?: number
  description?: string
  createdBy: string
  sender: string
  receiver: string
  appointmentId: string
  grossAmount: number
  netAmount: number
  fee: number
  currency: Currency | ZeroDecimalCurrencies
  tip: number
}

export interface ICreatePaymentService {
  data: ICreatePaymentData
}

interface IFindOnePaymentQuery {
  paymentId: string
}

export interface IFindOnePaymentService {
  query: IFindOnePaymentQuery
  credentials?: Credentials | Users
}

interface IUpdatePaymentQuery {
  paymentId: string
}

interface IUpdatePaymentData {
  status: PaymentStatus
}

export interface IUpdatePaymentService {
  query: IUpdatePaymentQuery
  data: IUpdatePaymentData
  credentials: Credentials | Users
}

export enum PaymentsSortBy {
  PAYMENTID = 'paymentId',
  APPOINTMENTID = 'appointmentId',
  GROSSAMOUNT = 'grossAmount',
  NETAMOUNT = 'netAmount',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

interface IFindManyPaymentsQuery {
  appointmentId?: string
  fromGrossAmount?: number
  toGrossAmount?: number
  fromNetAmount?: number
  toNetAmount?: number
  status?: PaymentStatus
  sender?: string
  receiver?: string

  sortBy?: PaymentsSortBy
  sortDirection?: SortDirection
  limit?: number
  offset?: number
}

export interface IFindManyPaymentsService {
  query: IFindManyPaymentsQuery
  credentials: Credentials
    relations?: string[]
}

export interface IFindManyPaymentsResult {
  list: Payments[]
  totalCount: number
}

// payment combined service
interface CreatePaymentData {
  amount: number
  discount?: number
  tip?: number
  currency: Currency
  paymentMethod: PaymentMethods
  customer: Customers
  connectedAccount: ConnectedAccounts
  description?: string
  appointmentId?: string
}

export interface CreatePaymentProps {
  data: CreatePaymentData
  credentials: Credentials
}
import { Credentials, SortDirection } from "../../common/types"
import { PaymentMethods } from "./paymentMethods.entity"

export enum PaymentMethodsType {
  ACSS_DEBIT = 'acss_debit',
  AFFIRM = 'affirm',
  AFTERPAY_CLEARPAY = 'afterpay_clearpay',
  ALIPAY = 'alipay',
  AU_BECS_DEBIT = 'au_becs_debit',
  BACS_DEBIT = 'bacs_debit',
  BANCONTACT = 'bancontact',
  BLIK = 'blik',
  BOLETO = 'boleto',
  CARD = 'card',
  CUSTOMER_BALANCE = 'customer_balance',
  EPS = 'eps',
  FPX = 'fpx',
  GIROPAY = 'giropay',
  IDEAL = 'ideal',
  KLARNA = 'klarna',
  KONBINI = 'konbini',
  LINK = 'link',
  OXXO = 'oxxo',
  P24 = 'p24',
  PAYNOW = 'paynow',
  PIX = 'pix',
  PROMPTPAY = 'promptpay',
  SEPA_DEBIT = 'sepa_debit',
  SOFORT = 'sofort',
  US_BANK_ACCOUNT = 'us_bank_account',
  WECHAT_PAY = 'wechat_pay'
}

interface ICreatePaymentMethodsData {
  customerId: string
  stripePaymentMethodId: string
  type: PaymentMethodsType
  cardHolderName: string
  lastFourNumbers: string
}

export interface ICreatePaymentMethodsService {
  data: ICreatePaymentMethodsData
}

interface IFindOnePaymentMethodQuery {
  paymentMethodId: string
  customerId?: string
}

export interface IFindOnePaymentMethodService {
  query: IFindOnePaymentMethodQuery
  credentials: Credentials
}

export enum PaymentMethodsSortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

interface IFindManyPaymentMethodsQuery {
  customerId?: string
  type?: PaymentMethodsType

  sortBy?: PaymentMethodsSortBy
  sortDirection?: SortDirection
  limit?: number
  offset?: number
}

export interface IFindManyPaymentMethodsService {
  query: IFindManyPaymentMethodsQuery
  credentials: Credentials
  relations?: string[]
}

export interface IFindManyPaymentMethodsResult {
  list: PaymentMethods[]
  totalCount: number
}


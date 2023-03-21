import { ConnectAccountBusinessType, ConnectAccountCountry, ConnectAccountLinkType } from "constant/constant"
import { ConnectedAccountsType } from "modules/connectedAccounts/connectedAccounts.type"

export enum StripeTypeOfEvent {
  PAYMENT_INTENT_FAILED = 'payment_intent.payment_failed',
  PAYMENT_INTENT_CANCELED = 'payment_intent.canceled',
  PAYMENT_INTENT_SUCCEEDED = 'payment_intent.succeeded',
}

interface ICreateCustomerData {
  email?: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
}

export interface ICreateCustomerService {
  data: ICreateCustomerData
}

interface ICreateAccountLinkData {
  refreshUrl: string
  returnUrl: string
  connectAccountType: ConnectedAccountsType
  connectAccountCountry: ConnectAccountCountry
  connectAccountBusinessType: ConnectAccountBusinessType
  connectAccountLinkType: ConnectAccountLinkType
}

export interface ICreateAccountLinkService {
  data: ICreateAccountLinkData
}

export interface ICreateAccountLinkResult {
  connectAccountLink: string
  connectAccountId: string
}

interface IFindOneAccountQuery {
  stripeConnectedAccountId: string
}

export interface IFindOneAccountService {
  query: IFindOneAccountQuery
}

interface IAddNewCardForCustomerData {
  cardNumber: string
  cardExpMonth: string
  cardExpYear: string
  cardCVC: string
  cardName?: string
  country?: string
  zipCode?: string
  stripeCustomerId: string
}

export interface ICreateCustomerCardMethodService {
  data: IAddNewCardForCustomerData
}

interface ITransferData {
  destination: string
}

interface ICreatePaymentIntentData {
  amount: number
  currency: string
  customer: string
  transferData: ITransferData
  paymentMethod: string
  description: string
  fee: number
}

export interface ICreatePaymentIntentService {
  data: ICreatePaymentIntentData
}

interface IConfirmPaymentIntentData {
  stripePaymentIntentId: string
}

export interface IConfirmPaymentIntentService {
  data: IConfirmPaymentIntentData
}

interface IConstructEventData {
  body: any
  signature: string
}

export interface IConstructEventService {
  data: IConstructEventData
}

import { ZeroDecimalCurrencies } from "../../modules/paymentIntents/paymentIntent.type";
import Stripe from "stripe";
import {
  ICreateCustomerCardMethodService,
  ICreateAccountLinkResult,
  ICreateAccountLinkService,
  ICreateCustomerService,
  IFindOneAccountService,
  ICreatePaymentIntentService,
  IConfirmPaymentIntentService,
  IConstructEventService
} from "./stripes.type";

export class StripesService {
  private stripe
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: process.env.STRIPE_API_VERSION as any,
    })
  }

  async createCustomer({
    data,
  }: ICreateCustomerService): Promise<string> {
    try {
      if (!data.email && !data.phoneNumber) {
        throw {
          code: 400,
          name: "UserNotFound",
        }
      }

      const customer = await this.stripe.customers.create({
        email: data.email,
        phone: data.phoneNumber,
        name: `${data.firstName} ${data.lastName}`
      })

      return customer.id
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async createAccountLink({
    data,
  }: ICreateAccountLinkService): Promise<ICreateAccountLinkResult> {
    try {
      const connectAccount = await this.stripe.accounts.create({
        country: data.connectAccountCountry,
        type: data.connectAccountType,
        business_type: data.connectAccountBusinessType,
        capabilities: { card_payments: { requested: true }, transfers: { requested: true }},
      })

      const connectAccountLink = await this.stripe.accountLinks.create({
        account: connectAccount.id,
        refresh_url: data.refreshUrl,
        return_url: data.returnUrl,
        type: data.connectAccountLinkType,
      })

      return {
        connectAccountLink: connectAccountLink.url,
        connectAccountId: connectAccount.id
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findOneAccount({
    query,
  }: IFindOneAccountService): Promise<Stripe.Account> {
    try {
      const connectedAccount = await this.stripe.accounts.retrieve(query.stripeConnectedAccountId)

      if (!connectedAccount) {
        throw {
          code: 404,
          name: 'ConnectedAccountNotFoundInStripe'
        }
      }

      if (connectedAccount.details_submitted === false || connectedAccount.charges_enabled === false) {
        throw {
          code: 400,
          name: 'ConnectedAccount authentication failed'
        }
      }

      return connectedAccount
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async createCustomerCardMethod({
    data,
  }: ICreateCustomerCardMethodService): Promise<Stripe.CustomerSource> {
    try {
      const cardToken = await this.stripe.tokens.create({
        card: {
          name: data?.cardName,
          number: data.cardNumber,
          exp_month: data.cardExpMonth,
          exp_year: data.cardExpYear,
          cvc: data.cardCVC,
          address_country: data?.country,
          address_zip: data?.zipCode
        }
      })

      const card = await this.stripe.customers.createSource(data.stripeCustomerId, {
        source: `${cardToken.id}`
      })

      return card
    } catch (error) {
      throw {
        statusCode: 400,
        name: `${error.type}`,
        message: `${error.message}`
      }
    }
  }

  async createPaymentIntent({
    data,
  }: ICreatePaymentIntentService): Promise<Stripe.PaymentIntent> {
    try {
      const { currency } = data

      /* All requests to the API must be expressed in the smallest unit of a currency.
      For example, to charge $10, you would enter a value amount of 1000
      For zero-decimal currencies (ZeroDecimalCurrencies),
      amounts are still expressed as whole numbers,
      but this time without multiplying them by 100.
      For example, to charge ¥500, you would enter a value amount of 500  */

      const amount = (Object.values(ZeroDecimalCurrencies) as string[])
      .includes(currency) ? data.amount : data.amount * 100

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount),
        currency: currency.toLocaleLowerCase(),
        customer: data.customer,
        transfer_data: data.transferData,
        payment_method: data.paymentMethod,
        application_fee_amount: data.fee,
      })

      return paymentIntent
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async confirmPaymentIntent({
    data,
  }: IConfirmPaymentIntentService): Promise<Stripe.PaymentIntent> {
    try {
      const confirmPaymentIntent = await this.stripe.paymentIntents.confirm(data.stripePaymentIntentId)

      return confirmPaymentIntent
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async constructEvent({
    data,
  }: IConstructEventService): Promise<Stripe.Webhooks> {
    try {
      const event = await this.stripe.webhooks.constructEvent(
        data.body,
        data.signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      )

      return event
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
